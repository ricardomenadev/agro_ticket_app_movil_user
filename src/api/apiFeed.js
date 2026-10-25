// Feed del agro (precios del día) desde el backend. Guarda la última respuesta para mostrar algo sin señal.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// EXPO_PUBLIC_API_URL solo se usa para probar contra un backend local (.env.local)
const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.agronea.store/api/mobile";
const CACHE_KEY = "agroFeed.markets";

export const fetchMarkets = async () => {
  const res = await fetch(`${API_URL}/feed/markets`);
  if (!res.ok) throw new Error(`precios: ${res.status}`);
  const json = await res.json();
  return json.data;
};

/** { markets, loading }: primero lo guardado en el teléfono, después lo fresco del servidor. */
export const useMarkets = () => {
  const [markets, setMarkets] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(CACHE_KEY)
      .then((raw) => alive && raw && setMarkets((m) => m || JSON.parse(raw)))
      .catch(() => {});
    fetchMarkets()
      .then((data) => {
        if (!alive || !data) return;
        setMarkets(data);
        AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data)).catch(() => {});
      })
      .catch(() => {}) // sin señal: queda lo guardado
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return { markets, loading };
};
