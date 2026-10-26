// "Mis entradas" de las compras web: se cargan con número de compra + DNI + mail y quedan guardadas en el teléfono
// (se ven sin señal). Usa las mismas rutas que la página agronea.store/mis-entradas: /api/my-tickets/...
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

// EXPO_PUBLIC_API_URL solo se usa para probar contra un backend local (.env.local)
const API = (process.env.EXPO_PUBLIC_API_URL || "https://api.agronea.store/api/mobile").replace(/\/mobile$/, "");
const STORAGE_KEY = "myTickets.orders"; // [{ token, order, savedAt }]

// Error con el mensaje del servidor (ya viene en castellano y para el cliente)
export const call = async (path, options) => {
  let res;
  try {
    res = await fetch(`${API}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
  } catch {
    throw Object.assign(new Error("No hay conexión. Probá de nuevo cuando tengas señal."), { offline: true });
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(json.message || "No pudimos procesar el pedido."), { status: res.status, errors: json.errors });
  return json.data;
};

export const lookupOrder = (input) => call("/my-tickets/lookup", { method: "POST", body: JSON.stringify(input) });
export const fetchOrder = (token) => call(`/my-tickets/order/${token}`);
// holder: { firstName, lastName, dni, email } de quien va a usar la entrada
export const passTicket = (token, ticketId, holder) =>
  call(`/my-tickets/order/${token}/tickets/${ticketId}/pass`, { method: "POST", body: JSON.stringify(holder) });
export const recoverTicket = (token, ticketId) => call(`/my-tickets/order/${token}/tickets/${ticketId}/recover`, { method: "POST" });

const readSaved = async () => {
  try {
    return JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) || "[]");
  } catch {
    return [];
  }
};

/**
 * Compras guardadas en el teléfono. Al abrir se actualizan con el servidor (si hay señal);
 * sin señal se muestra lo último guardado.
 */
export const useMyOrders = () => {
  const [orders, setOrders] = useState(null); // null mientras lee el teléfono
  const [refreshing, setRefreshing] = useState(false);

  const save = useCallback(async (list) => {
    setOrders(list);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list)).catch(() => {});
  }, []);

  const refresh = useCallback(async () => {
    const saved = await readSaved();
    setOrders(saved);
    if (!saved.length) return;
    setRefreshing(true);
    const fresh = await Promise.all(
      saved.map(async (o) => {
        try {
          return { ...o, order: await fetchOrder(o.token) };
        } catch {
          return o; // sin señal o error: queda la copia guardada
        }
      })
    );
    setRefreshing(false);
    await save(fresh);
  }, [save]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Agrega o reemplaza una compra (si ya estaba cargada no se duplica)
  const upsert = useCallback(
    async (token, order) => {
      const list = (await readSaved()).filter((o) => o.order?.orderNumber !== order.orderNumber);
      await save([{ token, order, savedAt: new Date().toISOString() }, ...list]);
    },
    [save]
  );

  const remove = useCallback(
    async (orderNumber) => save((await readSaved()).filter((o) => o.order?.orderNumber !== orderNumber)),
    [save]
  );

  return { orders, refreshing, refresh, upsert, remove };
};
