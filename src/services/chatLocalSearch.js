// src/services/chatLocalSearch.js
// Respuesta del chat SIN internet: busca por palabras en los documentos que el celular bajó la última vez.
// (Con internet responde el servidor, que busca por significado.) Sin imports para poder probarlo con Node.

export const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]{2,}/;
const GREETING_RE = /^(hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|saludos)\b/;
const STOP = new Set('para como donde cuando cual cuales tiene tienen hay puedo quiero saber esta estan desde hasta sobre entre porque pero tambien'.split(' '));
const MAX_LEN = 700;

export const normalize = (text) =>
  (text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

const words = (text) => normalize(text).split(/[^a-z0-9ñ]+/).filter(w => w.length > 3 && !STOP.has(w));

// Mismo comienzo de palabra cuenta como igual: "stands" ~ "stand", "electricidad" ~ "electrica"
const stem = (w) => w.slice(0, 5);

// Devuelve { type: 'email' | 'welcome' | 'answer' | 'none', text?, email? }
export const localAnswer = (message, eventData, topic) => {
  const email = message.match(EMAIL_RE)?.[0];
  if (email) return { type: 'email', email };

  const msg = normalize(message);
  if (GREETING_RE.test(msg) && msg.length < 30) return { type: 'welcome' };

  const query = [...new Set(words(message).map(stem))];
  if (!query.length) return { type: 'none' };

  let best = null;
  for (const faq of eventData?.faqs || []) {
    if (topic && faq.topic && faq.topic !== topic) continue;
    const titleStems = new Set(words(faq.pregunta).map(stem));
    for (const paragraph of String(faq.respuesta || '').split(/\n\s*\n/)) {
      const stems = new Set(words(paragraph).map(stem));
      // las palabras del título cuentan para todos sus párrafos
      const score = query.filter(q => stems.has(q) || titleStems.has(q)).length;
      if (score && (!best || score > best.score)) best = { score, text: paragraph.trim() };
    }
  }
  if (!best) return { type: 'none' };
  return { type: 'answer', text: best.text.length > MAX_LEN ? `${best.text.slice(0, MAX_LEN)}…` : best.text };
};
