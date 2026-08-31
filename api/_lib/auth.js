import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';
const MAX_AGE = 86400;

export function verifyPassword(password) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof password !== 'string') {
    return false;
  }
  return password === expected;
}

export function createSessionCookie() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not configured');
  }
  const payload = { exp: Date.now() + MAX_AGE * 1000 };
  const data = JSON.stringify(payload);
  const sig = crypto.createHmac('sha256', secret).update(data).digest('hex');
  const token = Buffer.from(`${data}.${sig}`).toString('base64url');
  const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; ${secure}SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
  return `${COOKIE_NAME}=; Path=/; HttpOnly; ${secure}SameSite=Lax; Max-Age=0`;
}

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) {
    return cookies;
  }
  cookieHeader.split(';').forEach((part) => {
    const [key, ...rest] = part.trim().split('=');
    if (key) {
      cookies[key] = decodeURIComponent(rest.join('='));
    }
  });
  return cookies;
}

export function isAuthenticated(req) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return false;
  }
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!token) {
    return false;
  }
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const dotIndex = decoded.lastIndexOf('.');
    if (dotIndex === -1) {
      return false;
    }
    const data = decoded.slice(0, dotIndex);
    const sig = decoded.slice(dotIndex + 1);
    const expected = crypto.createHmac('sha256', secret).update(data).digest('hex');
    if (sig !== expected) {
      return false;
    }
    const payload = JSON.parse(data);
    return payload.exp >= Date.now();
  } catch {
    return false;
  }
}

export function requireAuth(req, res) {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
