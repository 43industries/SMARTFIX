import { kv } from '@vercel/kv';
import { DEFAULT_CONTENT, mergeContent } from './content-defaults.js';

const CONTENT_KEY = 'site:content';
const MESSAGES_KEY = 'messages';
const MAX_MESSAGES = 200;

export async function getContent() {
  try {
    const stored = await kv.get(CONTENT_KEY);
    return mergeContent(stored);
  } catch {
    return mergeContent(null);
  }
}

export async function saveContent(content) {
  await kv.set(CONTENT_KEY, content);
}

export async function addMessage(message) {
  let messages = [];
  try {
    messages = (await kv.get(MESSAGES_KEY)) || [];
  } catch {
    messages = [];
  }
  if (!Array.isArray(messages)) {
    messages = [];
  }
  messages.unshift(message);
  if (messages.length > MAX_MESSAGES) {
    messages.length = MAX_MESSAGES;
  }
  await kv.set(MESSAGES_KEY, messages);
}

export async function getMessages() {
  try {
    const messages = await kv.get(MESSAGES_KEY);
    return Array.isArray(messages) ? messages : [];
  } catch {
    return [];
  }
}

export { DEFAULT_CONTENT, mergeContent };
