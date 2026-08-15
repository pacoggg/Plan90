import { randomBytes, scryptSync } from 'node:crypto';

if (!process.stdin.isTTY) {
  console.error('Ejecuta este comando en una terminal interactiva.');
  process.exit(1);
}

process.stdout.write('Contraseña (mínimo 12 caracteres): ');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');
let password = '';

process.stdin.on('data', chunk => {
  if (chunk === '\u0003') process.exit(130);
  if (chunk === '\r' || chunk === '\n') {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    process.stdout.write('\n');
    if (password.length < 12) {
      console.error('La contraseña debe tener al menos 12 caracteres.');
      process.exit(1);
    }
    const salt = randomBytes(16);
    const opts = { N: 16384, r: 8, p: 1 };
    const hash = scryptSync(password, salt, 64, opts);
    console.log(`scrypt$${opts.N}$${opts.r}$${opts.p}$${salt.toString('base64')}$${hash.toString('base64')}`);
    return;
  }
  if (chunk === '\u007f' || chunk === '\b') password = password.slice(0, -1);
  else password += chunk;
});
