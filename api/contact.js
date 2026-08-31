import crypto from 'crypto';
import crypto from 'crypto';
import { addMessage } from '../_lib/kv.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  if (body?.company) {
    return res.status(200).json({ success: true });
  }

  const name = String(body?.name || '').trim();
  const email = String(body?.email || '').trim();
  const phone = String(body?.phone || '').trim();
  const service = String(body?.service || '').trim();
  const message = String(body?.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const record = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name,
    email,
    phone,
    service,
    message
  };

  try {
    await addMessage(record);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to store message:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again or call us directly.' });
  }
}
