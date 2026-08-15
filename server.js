import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), 'data');
const DB_PATH = join(DATA_DIR, 'plan90.json');
const MAX_BODY = 1_000_000;
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const SESSION_SECRET = process.env.SESSION_SECRET || '';
const loginAttempts = new Map();
let writeQueue = Promise.resolve();

mkdirSync(DATA_DIR, { recursive: true });

const profileDefaults = {
  paco: { id: 'paco', name: 'Paco', startWeight: 98.5, targetWeight: 89.9, legacyStorageKey: 'plan90Data' },
  montse: { id: 'montse', name: 'Montse', startWeight: 73, targetWeight: 65, legacyStorageKey: 'plan90DataMontse' }
};

function emptyUser(id) {
  return {
    profile: profileDefaults[id],
    passwordHash: process.env[`${id.toUpperCase()}_PASSWORD_HASH`] || '',
    sessionVersion: randomBytes(16).toString('base64url'),
    progress: { weights: [], completed: {} },
    menu: null,
    updatedAt: new Date().toISOString()
  };
}

function loadDb() {
  if (!existsSync(DB_PATH)) {
    const fresh = { version: 1, users: { paco: emptyUser('paco'), montse: emptyUser('montse') } };
    persistSync(fresh);
    return fresh;
  }
  const parsed = JSON.parse(readFileSync(DB_PATH, 'utf8'));
  for (const id of Object.keys(profileDefaults)) {
    parsed.users[id] ||= emptyUser(id);
    parsed.users[id].profile = { ...profileDefaults[id], ...parsed.users[id].profile };
    parsed.users[id].sessionVersion ||= randomBytes(16).toString('base64url');
  }
  return parsed;
}

function persistSync(value) {
  const tmp = `${DB_PATH}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  renameSync(tmp, DB_PATH);
}

let db = loadDb();

if (SESSION_SECRET.length < 32) throw new Error('SESSION_SECRET debe tener al menos 32 caracteres.');

for (const id of Object.keys(profileDefaults)) {
  if (!parseHash(db.users[id].passwordHash)) {
    throw new Error(`Falta una contraseña válida para ${id}. Configura ${id.toUpperCase()}_PASSWORD_HASH antes de arrancar.`);
  }
}

function persist() {
  writeQueue = writeQueue.then(() => persistSync(db));
  return writeQueue;
}

function parseHash(encoded) {
  const [kind, n, r, p, salt, hash] = String(encoded).split('$');
  if (kind !== 'scrypt' || !hash) return null;
  return { N: Number(n), r: Number(r), p: Number(p), salt, hash };
}

function verifyPassword(password, encoded) {
  const parsed = parseHash(encoded);
  if (!parsed) return false;
  try {
    const actual = scryptSync(password, Buffer.from(parsed.salt, 'base64'), 64, { N: parsed.N, r: parsed.r, p: parsed.p });
    const expected = Buffer.from(parsed.hash, 'base64');
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function hashPassword(password) {
  const salt = randomBytes(16);
  const opts = { N: 16384, r: 8, p: 1 };
  const hash = scryptSync(password, salt, 64, opts);
  return `scrypt$${opts.N}$${opts.r}$${opts.p}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

function cookies(req) {
  return Object.fromEntries(String(req.headers.cookie || '').split(';').map(x => x.trim()).filter(Boolean).map(x => {
    const i = x.indexOf('=');
    return [decodeURIComponent(x.slice(0, i)), decodeURIComponent(x.slice(i + 1))];
  }));
}

function sessionSignature(payload) {
  return createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
}

function createSession(username) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `${username}.${expiresAt}.${db.users[username].sessionVersion}`;
  return `${payload}.${sessionSignature(payload)}`;
}

function currentUser(req) {
  const token = cookies(req).plan90_session;
  const [username, expiresAt, version, signature] = String(token || '').split('.');
  const user = db.users[username];
  if (!user || user.sessionVersion !== version || Number(expiresAt) < Math.floor(Date.now() / 1000)) return null;
  const expected = Buffer.from(sessionSignature(`${username}.${expiresAt}.${version}`));
  const actual = Buffer.from(signature || '');
  return actual.length === expected.length && timingSafeEqual(actual, expected) ? username : null;
}

function json(res, status, body, headers = {}) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'same-origin',
    ...headers
  });
  res.end(payload);
}

async function body(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY) throw new Error('Payload demasiado grande');
  }
  return raw ? JSON.parse(raw) : {};
}

function validOrigin(req) {
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) return true;
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}

function cleanProgress(value) {
  const weights = Array.isArray(value?.weights) ? value.weights.slice(0, 500).map(row => ({
    date: new Date(row.date).toISOString(),
    weight: Math.round(Number(row.weight) * 10) / 10,
    waist: row.waist == null ? null : Math.round(Number(row.waist) * 10) / 10
  })).filter(row => Number.isFinite(row.weight) && row.weight >= 35 && row.weight <= 300) : [];
  const completed = value?.completed && typeof value.completed === 'object' && !Array.isArray(value.completed)
    ? Object.fromEntries(Object.entries(value.completed).slice(0, 100).map(([k, v]) => [String(k).slice(0, 40), String(v).slice(0, 30)]))
    : {};
  return { weights, completed };
}

function cleanMenu(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Menú no válido');
  const result = {};
  for (const [day, meals] of Object.entries(value)) {
    if (!Array.isArray(meals) || meals.length > 8) throw new Error('Menú no válido');
    result[String(day).slice(0, 20)] = meals.map(meal => {
      if (!Array.isArray(meal) || meal.length < 2) throw new Error('Comida no válida');
      return [String(meal[0]).slice(0, 40), String(meal[1]).slice(0, 240), String(meal[2] || '').slice(0, 80)];
    });
  }
  return result;
}

function requireUser(req, res) {
  const username = currentUser(req);
  if (!username) json(res, 401, { error: 'Sesión no válida' });
  return username;
}

async function api(req, res, path) {
  if (!validOrigin(req)) return json(res, 403, { error: 'Origen no permitido' });

  if (path === '/api/health') return json(res, 200, { ok: true });
  if (path === '/api/session' && req.method === 'GET') {
    const username = currentUser(req);
    return json(res, 200, { authenticated: Boolean(username), profile: username ? db.users[username].profile : null });
  }
  if (path === '/api/login' && req.method === 'POST') {
    const ip = req.socket.remoteAddress || 'unknown';
    const attempt = loginAttempts.get(ip) || { count: 0, resetAt: Date.now() + 15 * 60_000 };
    if (attempt.resetAt < Date.now()) Object.assign(attempt, { count: 0, resetAt: Date.now() + 15 * 60_000 });
    if (attempt.count >= 10) return json(res, 429, { error: 'Demasiados intentos. Espera unos minutos.' });
    const input = await body(req);
    const username = String(input.username || '').toLowerCase();
    const user = db.users[username];
    if (!user?.passwordHash || !verifyPassword(String(input.password || ''), user.passwordHash)) {
      attempt.count++;
      loginAttempts.set(ip, attempt);
      return json(res, 401, { error: 'Usuario o contraseña incorrectos' });
    }
    loginAttempts.delete(ip);
    const token = createSession(username);
    return json(res, 200, { profile: user.profile }, { 'Set-Cookie': `plan90_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_MAX_AGE}` });
  }
  if (path === '/api/logout' && req.method === 'POST') {
    return json(res, 200, { ok: true }, { 'Set-Cookie': 'plan90_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0' });
  }

  const username = requireUser(req, res);
  if (!username) return;
  const user = db.users[username];

  if (path === '/api/state' && req.method === 'GET') {
    return json(res, 200, { profile: user.profile, progress: user.progress, menu: user.menu, updatedAt: user.updatedAt });
  }
  if (path === '/api/progress' && req.method === 'PUT') {
    user.progress = cleanProgress(await body(req));
    user.updatedAt = new Date().toISOString();
    await persist();
    return json(res, 200, { ok: true, updatedAt: user.updatedAt });
  }
  if (path === '/api/menu' && req.method === 'PUT') {
    user.menu = cleanMenu(await body(req));
    user.updatedAt = new Date().toISOString();
    await persist();
    return json(res, 200, { ok: true, menu: user.menu, updatedAt: user.updatedAt });
  }
  if (path === '/api/import' && req.method === 'POST') {
    const input = await body(req);
    user.progress = cleanProgress(input.progress);
    if (input.menu) user.menu = cleanMenu(input.menu);
    user.updatedAt = new Date().toISOString();
    await persist();
    return json(res, 200, { ok: true });
  }
  if (path === '/api/export' && req.method === 'GET') {
    return json(res, 200, { version: 1, exportedAt: new Date().toISOString(), profile: user.profile, progress: user.progress, menu: user.menu });
  }
  if (path === '/api/password' && req.method === 'POST') {
    const input = await body(req);
    const next = String(input.newPassword || '');
    if (!verifyPassword(String(input.currentPassword || ''), user.passwordHash)) return json(res, 403, { error: 'La contraseña actual no es correcta' });
    if (next.length < 12 || next.length > 200) return json(res, 400, { error: 'La nueva contraseña debe tener al menos 12 caracteres' });
    user.passwordHash = hashPassword(next);
    user.sessionVersion = randomBytes(16).toString('base64url');
    user.updatedAt = new Date().toISOString();
    await persist();
    return json(res, 200, { ok: true });
  }
  return json(res, 404, { error: 'No encontrado' });
}

const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon'
};

function staticFile(req, res, path) {
  const requested = path === '/' ? '/index.html' : path;
  const safe = normalize(requested).replace(/^(\.\.[/\\])+/, '');
  const file = join(process.cwd(), safe);
  if (!file.startsWith(process.cwd()) || !existsSync(file)) {
    res.writeHead(404); res.end('No encontrado'); return;
  }
  const noCache = ['.html', '.js', '.css', '.json'].includes(extname(file)) || file.endsWith('service-worker.js');
  res.writeHead(200, {
    'Content-Type': mime[extname(file)] || 'application/octet-stream',
    'Cache-Control': noCache ? 'no-cache' : 'public, max-age=604800, immutable',
    'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'SAMEORIGIN', 'Referrer-Policy': 'same-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'"
  });
  createReadStream(file).pipe(res);
}

createServer(async (req, res) => {
  try {
    const path = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
    if (path.startsWith('/api/')) await api(req, res, path);
    else staticFile(req, res, path);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) json(res, 400, { error: error.message || 'Solicitud no válida' });
    else res.end();
  }
}).listen(PORT, '0.0.0.0', () => console.log(`Plan90 listening on ${PORT}`));
