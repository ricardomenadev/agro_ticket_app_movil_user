// src/services/chatService.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import chatDataFallback from '../data/chatDataFallback.json';
import { localAnswer } from './chatLocalSearch';

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
  pendingLeads: 'agronea_chat_pendingLeads', // mails dejados sin internet, se mandan al volver la señal
};

// Límite de consultas con IA por defecto, si el JSON no lo trae.
// Unificado en 10 (antes había un 5 y un 10 mezclados en el código).
const DEFAULT_AI_LIMIT = 10;

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

// ─── Mails de interesados ─────────────────────────────────────────────────────

const postLead = async (lead) => {
  const response = await fetch(`${API_URL}/public/chat-lead`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(lead),
  });
  const json = await response.json().catch(() => ({}));
  // 400: el mail está mal escrito → se avisa, no se guarda para después
  if (response.status === 400) return { ok: false, message: json.message };
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return { ok: true, message: json.message };
};

const queueLead = async (lead) => {
  try {
    const stored = JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.pendingLeads)) || '[]');
    stored.push(lead);
    await AsyncStorage.setItem(STORAGE_KEYS.pendingLeads, JSON.stringify(stored));
  } catch (error) {
    console.warn('[ChatService] Error guardando mail pendiente:', error.message);
  }
};

// Guarda el mail de alguien que quiere recibir información. Sin internet queda en el celular
// y se manda la próxima vez que se abre el chat con señal.
export const saveLead = async ({ email, name, company, topic = 'expositor' }) => {
  const lead = { email: email.trim(), name, company, topic, deviceId: await getDeviceId() };
  try {
    return await postLead(lead);
  } catch (error) {
    await queueLead(lead);
    return { ok: true, queued: true, message: '¡Listo! Guardamos tu mail. Lo mandamos apenas tengas internet y te escribimos cuando haya novedades 🙌' };
  }
};

export const flushPendingLeads = async () => {
  let stored;
  try {
    stored = JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.pendingLeads)) || '[]');
  } catch {
    return;
  }
  if (!stored.length) return;
  const left = [];
  for (const lead of stored) {
    try { await postLead(lead); } catch { left.push(lead); }
  }
  await AsyncStorage.setItem(STORAGE_KEYS.pendingLeads, JSON.stringify(left)).catch(() => {});
};

// ─── Envío de mensaje — flujo principal ──────────────────────────────────────

export const sendMessage = async (message, history, eventData, topic) => {
  const deviceId = await getDeviceId();
  const aiUsage  = await getAiUsage();

  // ── Intentar backend primero ───────────────────────────────────────────────
  try {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

    const response = await fetch(`${API_URL}/public/chat-message`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ deviceId, message, history, aiUsage, topic }),
      signal:  controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json   = await response.json();
      const result = json.data;
      await saveAiUsage(result.aiUsage);

      return {
        response: result.response,
        usedAI:   result.usedAI,
        logId:    result.logId || null,
        aiUsage:  result.aiUsage
      };
    }
  } catch (error) {
    console.warn('[ChatService] Sin conexión, usando motor local:', error.message);
  }

  // ── Sin internet: busca en lo que bajó el celular la última vez ────────────
  const local = localAnswer(message, eventData, topic);
  let responseText;
  if (local.type === 'email') {
    responseText = (await saveLead({ email: local.email, topic: topic || 'expositor' })).message;
  } else if (local.type === 'welcome') {
    responseText = eventData?.temas?.[topic || 'visitante']?.welcome;
  } else if (local.type === 'answer') {
    responseText = local.text;
  }

  return {
    response: responseText || eventData?.noAnswer || 'Todavía no tengo esa información. Escribinos por WhatsApp al +54 9 3794 222011 y te respondemos.',
    usedAI:   false,
    logId:    null,
    aiUsage   // sin cambios porque no se usó el backend
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