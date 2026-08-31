import { verifyPassword, createSessionCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const password = body?.password;
  if (!verifyPassword(password)) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  try {
    res.setHeader('Set-Cookie', createSessionCookie());
    return res.status(200).json({ authenticated: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server configuration error' });
  }
}
