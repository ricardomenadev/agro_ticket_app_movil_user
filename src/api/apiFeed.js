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

// Vitrina de la tienda (título, texto y fotos que se editan en el panel): /api/store/showcase
export const fetchShowcase = async () => {
  const res = await fetch(`${API_URL.replace(/\/mobile$/, "")}/store/showcase`);
  if (!res.ok) throw new Error(`vitrina: ${res.status}`);
  return (await res.json()).data;
};

export const useShowcase = () => {
  const { data } = useCachedFeed("agroFeed.showcase", fetchShowcase);
  return data;
};

// Clima de Charata (Open-Meteo, sin clave): ahora, máxima, mínima y probabilidad de lluvia del día
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-27.2144&longitude=-61.1882" +
  "&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
  "&forecast_days=1&timezone=America%2FArgentina%2FBuenos_Aires";

export const fetchWeather = async () => {
  const res = await fetch(WEATHER_URL);
  if (!res.ok) throw new Error(`clima: ${res.status}`);
  const d = await res.json();
  return {
    temp: d.current?.temperature_2m,
    code: d.current?.weather_code,
    isDay: d.current?.is_day === 1,
    max: d.daily?.temperature_2m_max?.[0],
    min: d.daily?.temperature_2m_min?.[0],
    rain: d.daily?.precipitation_probability_max?.[0],
  };
};

export const useWeather = () => useCachedFeed("agroFeed.weather", fetchWeather).data;

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
