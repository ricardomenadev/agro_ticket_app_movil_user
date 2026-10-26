// Invitaciones en la app (mismas rutas que agronea.store/i/<token>):
// - el invitado guarda su invitación con QR (se anota acá o la carga con código + DNI);
// - la empresa guarda el link de su cupo para ver la lista, anotar gente y sacar con la contraseña.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { call } from "./apiMyTickets";

export const fetchQuota = (token) => call(`/invitations/${token}`);
export const registerGuest = (token, guest) => call(`/invitations/${token}/guests`, { method: "POST", body: JSON.stringify(guest) });
export const removeGuest = (token, guestId, code) =>
  call(`/invitations/${token}/guests/${guestId}`, { method: "DELETE", body: JSON.stringify({ code }) });
export const lookupInvitation = (input) => call("/invitations/lookup", { method: "POST", body: JSON.stringify(input) });

/** Token del cupo a partir de lo que pegue la persona: el link completo o solo el código. */
export const quotaTokenFrom = (text) => {
  const s = String(text || "").trim();
  const m = s.match(/\/i\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : /^[A-Za-z0-9_-]{6,}$/.test(s) ? s : null;
};

export const quotaLink = (token) => `https://agronea.store/i/${token}`;

/** Lista guardada en el teléfono. idOf: cómo se identifica cada elemento (para no duplicar). */
const useSavedList = (key, idOf) => {
  const [items, setItems] = useState(null);
  const read = useCallback(async () => {
    try {
      return JSON.parse((await AsyncStorage.getItem(key)) || "[]");
    } catch {
      return [];
    }
  }, [key]);
  const save = useCallback(
    async (list) => {
      setItems(list);
      await AsyncStorage.setItem(key, JSON.stringify(list)).catch(() => {});
    },
    [key]
  );
  useEffect(() => {
    read().then(setItems);
  }, [read]);
  const upsert = useCallback(async (item) => save([item, ...(await read()).filter((x) => idOf(x) !== idOf(item))]), [read, save, idOf]);
  const remove = useCallback(async (id) => save((await read()).filter((x) => idOf(x) !== id)), [read, save, idOf]);
  return { items, upsert, remove };
};

const byCode = (x) => x.code;
const byToken = (x) => x.token;
export const useMyInvitations = () => useSavedList("myTickets.invitations", byCode); // [{ code, name, dni, qrCode, company, event }]
export const useMyQuotas = () => useSavedList("myTickets.quotas", byToken); // [{ token, company, eventTitle }]
