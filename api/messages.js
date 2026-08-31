import { requireAuth } from '../_lib/auth.js';
import { getMessages } from '../_lib/kv.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireAuth(req, res)) {
    return;
  }

  const messages = await getMessages();
  return res.status(200).json({ messages });
}
