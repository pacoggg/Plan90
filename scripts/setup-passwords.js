import { randomBytes, scryptSync } from 'node:crypto';
import { chmodSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

if (!process.stdin.isTTY) {
  console.error('Ejecuta este comando en una terminal interactiva.');
  process.exit(1);
}

const envPath = resolve('.plan90.env');

function hiddenPrompt(label) {
  return new Promise((resolvePrompt, reject) => {
    let value = '';
    process.stdout.write(label);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    const onData = chunk => {
      if (chunk === '\u0003') {
        cleanup();
        reject(new Error('Cancelado'));
        return;
      }
      if (chunk === '\r' || chunk === '\n') {
        cleanup();
        process.stdout.write('\n');
        resolvePrompt(value);
        return;
      }
      if (chunk === '\u007f' || chunk === '\b') value = value.slice(0, -1);
      else if (!chunk.startsWith('\u001b')) value += chunk;
    };

    function cleanup() {
      process.stdin.off('data', onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    }

    process.stdin.on('data', onData);
  });
}

function hashPassword(password) {
  const salt = randomBytes(16);
  const opts = { N: 16384, r: 8, p: 1 };
  const hash = scryptSync(password, salt, 64, opts);
  return `scrypt$${opts.N}$${opts.r}$${opts.p}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

async function askPassword(name) {
  const password = await hiddenPrompt(`PIN de ${name} (4 cifras): `);
  if (!/^\d{4}$/.test(password)) throw new Error(`El PIN de ${name} debe tener exactamente 4 cifras.`);
  const confirmation = await hiddenPrompt(`Repite el PIN de ${name}: `);
  if (password !== confirmation) throw new Error(`Los PIN de ${name} no coinciden.`);
  return password;
}

try {
  if (existsSync(envPath) && !process.argv.includes('--force')) {
    throw new Error('Ya existe .plan90.env. Usa npm run setup-passwords -- --force solo durante la configuración inicial.');
  }

  const pacoPassword = await askPassword('Paco');
  const montsePassword = await askPassword('Montse');
  const content = [
    `PACO_PASSWORD_HASH=${hashPassword(pacoPassword)}`,
    `MONTSE_PASSWORD_HASH=${hashPassword(montsePassword)}`,
    `SESSION_SECRET=${randomBytes(48).toString('base64url')}`,
    ''
  ].join('\n');

  writeFileSync(envPath, content, { encoding: 'utf8', mode: 0o600 });
  chmodSync(envPath, 0o600);
  console.log('Configuración privada guardada en .plan90.env. Los PIN no se han mostrado ni almacenado en texto claro.');
} catch (error) {
  process.stdin.isTTY && process.stdin.setRawMode?.(false);
  console.error(error.message);
  process.exit(1);
}
