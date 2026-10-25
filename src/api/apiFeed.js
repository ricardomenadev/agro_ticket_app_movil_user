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

export const fetchNews = async () => {
  const res = await fetch(`${API_URL}/feed/news`);
  if (!res.ok) throw new Error(`noticias: ${res.status}`);
  return (await res.json()).data;
};

/** Primero lo guardado en el teléfono, después lo fresco del servidor. → { data, loading } */
const useCachedFeed = (cacheKey, fetcher) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(cacheKey)
      .then((raw) => alive && raw && setData((d) => d || JSON.parse(raw)))
      .catch(() => {});
    fetcher()
      .then((fresh) => {
        if (!alive || !fresh) return;
        setData(fresh);
        AsyncStorage.setItem(cacheKey, JSON.stringify(fresh)).catch(() => {});
      })
      .catch(() => {}) // sin señal: queda lo guardado
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading };
};

export const useMarkets = () => {
  const { data, loading } = useCachedFeed(CACHE_KEY, fetchMarkets);
  return { markets: data, loading };
};

export const useNews = () => {
  const { data, loading } = useCachedFeed("agroFeed.news", fetchNews);
  return { news: data, loading };
};
