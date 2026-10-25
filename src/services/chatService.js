// src/services/chatService.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import Fuse from 'fuse.js';
import chatDataFallback from '../data/chatDataFallback.json';
import { EXHIBITORS_DATA } from '../constants/exhibitorsData2026';

// ─── Configuración ────────────────────────────────────────────────────────────

const API_URL = __DEV__
  ? 'http://192.168.1.244:5000/api'
  : 'https://api.agronea.store/api';

// Timeout corto para la carga del JSON de datos: si el server no responde
// rápido, usamos el fallback embebido (mismo contenido). No bloquea el arranque.
const DATA_TIMEOUT_MS = 3000;
// Timeout largo para el mensaje con IA: ahí sí esperamos a la red lenta
// porque queremos la respuesta real de Claude.
const AI_TIMEOUT_MS = 8000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const STORAGE_KEYS = {
  deviceId:    'agronea_chat_deviceId',
  aiUsage:     'agronea_chat_aiUsage',
  offlineData: 'agronea_chat_offlineData',
};

// Límite de consultas con IA por defecto, si el JSON no lo trae.
// Unificado en 10 (antes había un 5 y un 10 mezclados en el código).
const DEFAULT_AI_LIMIT = 10;

// ─── Palabras de intención — usadas SOLO en el motor offline ─────────────────
const EXPOSITOR_INTENT_KEYWORDS = [
  'donde esta', 'dónde está', 'donde queda', 'dónde queda',
  'busco', 'buscar', 'encontrar',
  'stand de', 'stand del',
  'empresa', 'expositor',
  'donde puedo ver', 'donde puedo encontrar',
  'tienen stand', 'tiene stand',
  'ubicacion de', 'ubicación de',
];

// ─── Fuse.js — solo para el motor offline ────────────────────────────────────

const FUSE_OPTIONS = {
  keys: [
    { name: 'name',        weight: 0.5 },
    { name: 'id',          weight: 0.2 },
    { name: 'keywords',    weight: 0.2 },
    { name: 'description', weight: 0.1 },
  ],
  threshold: 0.40,
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
};

const fuseIndex = new Fuse(EXHIBITORS_DATA, FUSE_OPTIONS);

const DIRECT_ANSWER_SCORE = 0.10;
const DISAMBIGUATION_MAX  = 3;

// ─── Comparación de versiones (semver simple) ────────────────────────────────
// Compara "1.10.0" vs "1.9.0" correctamente (numérico por segmento).
// Devuelve true si A es MÁS NUEVA que B.
// Antes se comparaba con > de strings, lo que daba resultados erróneos
// (ej: "1.10.0" > "1.9.0" devuelve false comparando como texto).
const isVersionNewer = (a, b) => {
  if (!a) return false;
  if (!b) return true;
  const pa = String(a).split('.').map(n => parseInt(n, 10) || 0);
  const pb = String(b).split('.').map(n => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x > y) return true;
    if (x < y) return false;
  }
  return false; // iguales
};

// ─── Device ID ────────────────────────────────────────────────────────────────

const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

export const getDeviceId = async () => {
  try {
    let deviceId = await AsyncStorage.getItem(STORAGE_KEYS.deviceId);
    if (!deviceId) {
      deviceId = generateUUID();
      await AsyncStorage.setItem(STORAGE_KEYS.deviceId, deviceId);
    }
    return deviceId;
  } catch (error) {
    console.warn('[ChatService] Error con deviceId:', error.message);
    return generateUUID();
  }
};

// ─── Datos del evento ─────────────────────────────────────────────────────────

// Devuelve AL INSTANTE la mejor data local disponible (lo guardado en
// AsyncStorage o el fallback embebido, lo que sea más nuevo).
// No toca la red, así el chat abre sin esperar.
export const getEventDataInstant = async () => {
  let localData = null;
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.offlineData);
    if (stored) localData = JSON.parse(stored);
  } catch (e) {
    console.warn('[ChatService] Error leyendo AsyncStorage:', e.message);
  }

  // Si el fallback embebido (que viene con la app actualizada) es más nuevo
  // que lo guardado, uso el fallback. Corrige quedar pegado a una versión vieja.
  let bestLocal = localData;
  if (!bestLocal || isVersionNewer(chatDataFallback.version, bestLocal.version)) {
    bestLocal = chatDataFallback;
  }
  return bestLocal;
};

// Va al servidor EN SEGUNDO PLANO. Si trae una versión más nueva, la guarda
// y la devuelve para que la pantalla la aplique. Si no hay nada nuevo
// (o no hay internet), devuelve null y no pasa nada.
// Usa timeout corto: la data ya la tenemos local, no vale la pena esperar mucho.
export const refreshEventDataFromServer = async (currentVersion) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DATA_TIMEOUT_MS);

    const response = await fetch(`${API_URL}/public/chat-data`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      const serverData = json.data;
      if (serverData && isVersionNewer(serverData.version, currentVersion)) {
        await AsyncStorage.setItem(STORAGE_KEYS.offlineData, JSON.stringify(serverData));
        console.log('[ChatService] JSON actualizado a versión', serverData.version);
        return serverData;
      }
    }
  } catch (error) {
    // Sin internet o timeout → no pasa nada, seguimos con la data local
    console.warn('[ChatService] No se pudo refrescar JSON:', error.message);
  }
  return null;
};

// Compatibilidad: getEventData() sigue existiendo pero ahora devuelve
// la data instantánea. El refresh se hace aparte desde la pantalla.
export const getEventData = async () => {
  return getEventDataInstant();
};

// ─── Rate limit ───────────────────────────────────────────────────────────────

export const getAiUsage = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.aiUsage);
    if (stored) {
      const usage = JSON.parse(stored);
      const elapsed = Date.now() - usage.windowStart;
      if (elapsed >= RATE_LIMIT_WINDOW_MS) {
        const fresh = { count: 0, windowStart: Date.now() };
        await AsyncStorage.setItem(STORAGE_KEYS.aiUsage, JSON.stringify(fresh));
        return fresh;
      }
      return usage;
    }
  } catch (error) {
    console.warn('[ChatService] Error leyendo aiUsage:', error.message);
  }
  return { count: 0, windowStart: Date.now() };
};

export const saveAiUsage = async (aiUsage) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.aiUsage, JSON.stringify(aiUsage));
  } catch (error) {
    console.warn('[ChatService] Error guardando aiUsage:', error.message);
  }
};

// ─── Normalización ────────────────────────────────────────────────────────────

const normalize = (text) =>
  (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

// ─── Detección de intención — solo para el motor offline ─────────────────────

const hasExpositorIntent = (message) => {
  const texto = normalize(message);
  return EXPOSITOR_INTENT_KEYWORDS.some(kw => texto.includes(normalize(kw)));
};

// ─── Motor de keywords para FAQs — solo offline ──────────────────────────────

export const keywordSearchFaq = (message, eventData) => {
  const texto = normalize(message);
  let mejorFaq = null;
  let mejorScore = 0;

  for (const faq of eventData.faqs) {
    let score = 0;
    for (const keyword of faq.keywords) {
      if (texto.includes(normalize(keyword))) score++;
    }
    if (score > mejorScore) {
      mejorScore = score;
      mejorFaq = faq;
    }
  }

  return mejorScore >= 1 ? mejorFaq : null;
};

// ─── Búsqueda fuzzy de expositores — solo offline ────────────────────────────

export const fuzzySearchExpositor = (message) => {
  const results = fuseIndex.search(message);
  if (!results.length) return { type: 'none' };

  const best = results[0];

  if (best.score <= DIRECT_ANSWER_SCORE) {
    return { type: 'direct', expositor: best.item };
  }

  const candidates = results.slice(0, DISAMBIGUATION_MAX).map(r => r.item);
  return { type: 'disambiguation', candidates };
};

// Quita las palabras de intención del mensaje para buscar solo el nombre.
// "ubicación de akron" → "akron"
const stripIntentWords = (message) => {
  let texto = normalize(message);
  for (const kw of EXPOSITOR_INTENT_KEYWORDS) {
    texto = texto.replace(normalize(kw), ' ');
  }
  return texto.trim().replace(/\s+/g, ' ');
};

// ─── Formato de respuesta de expositor ───────────────────────────────────────

export const formatExpositorResponse = (exp) => {
  let resp = `*${exp.name}*`;
  if (exp.description) resp += `\n${exp.description}`;
  if (exp.stand)       resp += `\nStand: ${exp.stand}`;
  if (exp.category)    resp += ` | Categoría: ${exp.category}`;
  if (!exp.stand)      resp += `\nEl stand se confirma en los carteles del predio o en Informes (punto 12).`;
  return resp;
};

// ─── Búsqueda local completa — SOLO se usa cuando no hay internet ─────────────
//
// ORDEN CORREGIDO:
//   1. Si hay INTENCIÓN de expositor ("ubicación de X", "stand de X", "dónde está X")
//      → buscar el EXPOSITOR primero (sacando las palabras de intención).
//      Esto evita que "ubicación de akron" caiga en la FAQ de ubicación del predio.
//   2. Si no hay intención → FAQs primero (comportamiento normal).
//   3. Match directo de expositor por nombre exacto (sin intención).

export const localSearch = (message, eventData) => {
  const tieneIntencion = hasExpositorIntent(message);

  // 1. Intención de expositor → buscar expositor ANTES que FAQs
  if (tieneIntencion) {
    const soloNombre = stripIntentWords(message);
    const fuzzyIntent = soloNombre.length >= 2
      ? fuzzySearchExpositor(soloNombre)
      : { type: 'none' };

    if (fuzzyIntent.type === 'direct') {
      return { type: 'expositor', data: fuzzyIntent.expositor };
    }
    if (fuzzyIntent.type === 'disambiguation') {
      // Si hay un candidato claramente mejor, lo devuelvo directo;
      // si son varios parecidos, desambiguo.
      return { type: 'disambiguation', data: fuzzyIntent.candidates };
    }
    // Si no encontró nada con el nombre, pido el nombre
    return { type: 'ask_name' };
  }

  // 2. Sin intención → FAQs primero
  const faq = keywordSearchFaq(message, eventData);
  if (faq) return { type: 'faq', data: faq };

  // 3. Match directo de expositor por nombre exacto
  const fuzzyResult = fuzzySearchExpositor(message);
  if (fuzzyResult.type === 'direct') return { type: 'expositor', data: fuzzyResult.expositor };

  return { type: 'none' };
};

// ─── Envío de mensaje — flujo principal ──────────────────────────────────────

export const sendMessage = async (message, history, eventData) => {
  const deviceId = await getDeviceId();
  const aiUsage  = await getAiUsage();

  // ── Intentar backend primero ───────────────────────────────────────────────
  try {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

    const response = await fetch(`${API_URL}/public/chat-message`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ deviceId, message, history, aiUsage }),
      signal:  controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json   = await response.json();
      const result = json.data;
      await saveAiUsage(result.aiUsage);

      return {
        type:     'response',
        response: result.response,
        usedAI:   result.usedAI,
        logId:    result.logId || null,
        aiUsage:  result.aiUsage
      };
    }
  } catch (error) {
    console.warn('[ChatService] Sin conexión, usando motor local:', error.message);
  }

  // ── Motor local completo — fallback sin internet ───────────────────────────
  const localResult = localSearch(message, eventData);

  if (localResult.type === 'disambiguation') {
    return {
      type:       'disambiguation',
      candidates: localResult.data
    };
  }

  let responseText;
  let matchedFaqId = null;

  if (localResult.type === 'faq') {
    responseText = localResult.data.respuesta;
    matchedFaqId = localResult.data.id;
  } else if (localResult.type === 'expositor') {
    responseText = formatExpositorResponse(localResult.data);
  } else if (localResult.type === 'ask_name') {
    responseText = '¿Qué expositor estás buscando? Escribí el nombre y te digo en qué stand está.';
  } else {
    responseText = 'No tengo información sobre eso. Podés consultar en el stand de Informes o escribir al WhatsApp 3794 222011.';
  }

  return {
    type:         'response',
    response:     responseText,
    usedAI:       false,
    logId:        null,
    matchedFaqId,
    aiUsage       // sin cambios porque no se usó el backend
  };
};

// ─── Feedback ─────────────────────────────────────────────────────────────────

export const sendFeedback = async (logId, wasHelpful, comment = null) => {
  if (!logId) return;
  try {
    await fetch(`${API_URL}/public/chat-feedback`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ logId, wasHelpful, comment })
    });
  } catch (error) {
    console.warn('[ChatService] Error enviando feedback:', error.message);
  }
};