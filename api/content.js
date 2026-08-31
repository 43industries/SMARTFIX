import { requireAuth } from '../_lib/auth.js';
import { getContent, saveContent, mergeContent } from '../_lib/kv.js';

function sanitizeContent(body) {
  const merged = mergeContent(body);
  return {
    hero: {
      title: String(merged.hero.title || '').slice(0, 500),
      subtitle: String(merged.hero.subtitle || '').slice(0, 1000)
    },
    services: {
      title: String(merged.services.title || '').slice(0, 200),
      subtitle: String(merged.services.subtitle || '').slice(0, 500),
      items: (merged.services.items || []).slice(0, 20).map((item) => ({
        icon: String(item.icon || '').slice(0, 8),
        title: String(item.title || '').slice(0, 120),
        text: String(item.text || '').slice(0, 500)
      }))
    },
    about: {
      title: String(merged.about.title || '').slice(0, 200),
      paragraph1: String(merged.about.paragraph1 || '').slice(0, 2000),
      paragraph2: String(merged.about.paragraph2 || '').slice(0, 2000),
      features: (merged.about.features || []).slice(0, 20).map((f) => String(f).slice(0, 200))
    },
    contact: {
      phone: String(merged.contact.phone || '').slice(0, 50),
      phoneTel: String(merged.contact.phoneTel || '').slice(0, 30),
      email: String(merged.contact.email || '').slice(0, 120),
      address: String(merged.contact.address || '').slice(0, 500),
      hours: String(merged.contact.hours || '').slice(0, 500)
    },
    quote: {
      title: String(merged.quote.title || '').slice(0, 200),
      subtitle: String(merged.quote.subtitle || '').slice(0, 500)
    },
    footer: {
      description: String(merged.footer.description || '').slice(0, 1000)
    }
  };
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const content = await getContent();
    return res.status(200).json(content);
  }

  if (req.method === 'PUT') {
    if (!requireAuth(req, res)) {
      return;
    }

    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    const content = sanitizeContent(body);
    await saveContent(content);
    return res.status(200).json(content);
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method not allowed' });
}
