import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { randomBytes, scryptSync } from 'node:crypto';

const port = 39190;
const dataDir = mkdtempSync(join(tmpdir(), 'plan90-test-'));
const password = 'correct-horse-battery';

function passwordHash(value) {
  const salt=randomBytes(16); const hash=scryptSync(value,salt,64,{N:16384,r:8,p:1});
  return `scrypt$16384$8$1$${salt.toString('base64')}$${hash.toString('base64')}`;
}

const child = spawn(process.execPath, ['server.js'], {
  cwd: process.cwd(),
  env: { ...process.env, PORT:String(port), DATA_DIR:dataDir, PACO_PASSWORD_HASH:passwordHash(password), MONTSE_PASSWORD_HASH:passwordHash(password), SESSION_SECRET:'test-session-secret-with-at-least-32-characters' },
  stdio: ['ignore','pipe','pipe']
});

async function waitForServer() {
  for(let i=0;i<30;i++) {
    try { const r=await fetch(`http://127.0.0.1:${port}/api/health`); if(r.ok)return; } catch {}
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  throw new Error('El servidor no arrancó');
}

test('autenticación, aislamiento y persistencia de progreso', async () => {
  await waitForServer();
  const home=await fetch(`http://127.0.0.1:${port}/`);
  assert.equal(home.status,200);
  assert.match(await home.text(),/Plan 90/);
  const anonymous=await fetch(`http://127.0.0.1:${port}/api/state`);
  assert.equal(anonymous.status,401);

  const login=await fetch(`http://127.0.0.1:${port}/api/login`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username:'paco',password})});
  assert.equal(login.status,200);
  const cookie=login.headers.get('set-cookie').split(';')[0];

  const progress={weights:[{date:'2026-08-15T08:00:00.000Z',weight:95.4,waist:101}],completed:{Lunes:'2026-08-15'}};
  const saved=await fetch(`http://127.0.0.1:${port}/api/progress`,{method:'PUT',headers:{cookie,'content-type':'application/json'},body:JSON.stringify(progress)});
  assert.equal(saved.status,200);
  const state=await fetch(`http://127.0.0.1:${port}/api/state`,{headers:{cookie}}).then(r=>r.json());
  assert.deepEqual(state.progress,progress);

  const menu={Lunes:[['Comida','Menú personalizado','']]};
  const menuSaved=await fetch(`http://127.0.0.1:${port}/api/menu`,{method:'PUT',headers:{cookie,'content-type':'application/json'},body:JSON.stringify(menu)});
  assert.equal(menuSaved.status,200);
  const exported=await fetch(`http://127.0.0.1:${port}/api/export`,{headers:{cookie}}).then(r=>r.json());
  assert.deepEqual(exported.menu,menu);

  const montseLogin=await fetch(`http://127.0.0.1:${port}/api/login`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username:'montse',password})});
  const montseCookie=montseLogin.headers.get('set-cookie').split(';')[0];
  const montseState=await fetch(`http://127.0.0.1:${port}/api/state`,{headers:{cookie:montseCookie}}).then(r=>r.json());
  assert.deepEqual(montseState.progress,{weights:[],completed:{}});
  assert.equal(montseState.menu,null);
});

test.after(() => {
  child.kill();
  rmSync(dataDir,{recursive:true,force:true});
});
