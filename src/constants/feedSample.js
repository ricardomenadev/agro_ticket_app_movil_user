// Noticias de EJEMPLO para el rediseño (los precios ya vienen del servidor: api/apiFeed.js).
// shortcut: noticias fijas, hasta que exista el feed de noticias en el backend.

export const SAMPLE = true;

export const NEWS_NEA = [
  { id: "n1", tag: "AGRICULTURA · CHACO", title: "Acá va la noticia más importante del día para el NEA", source: "Ejemplo", ago: "hace 2 h", featured: true },
  { id: "n2", tag: "GANADERÍA · FORMOSA", title: "Acá va una noticia ganadera de la región", source: "Ejemplo", ago: "hace 5 h" },
  { id: "n3", tag: "INTA · SÁENZ PEÑA", title: "Acá va una recomendación técnica del INTA para la zona", source: "INTA", ago: "ayer" },
];

export const NEWS_NATIONAL = [
  { id: "x1", tag: "NACIONAL", title: "Acá va una medida nacional que afecta al productor", source: "Ejemplo", ago: "hoy" },
  { id: "x2", tag: "NACIONAL", title: "Acá va la estimación de cosecha de la Bolsa", source: "Ejemplo", ago: "ayer" },
];

export const NEWS_MARKETS = [
  { id: "m1", tag: "GRANOS · ROSARIO", title: "Acá va por qué se movió la soja esta semana", source: "Ejemplo", ago: "hoy" },
  { id: "m2", tag: "HACIENDA · CAÑUELAS", title: "Acá va el resumen semanal de hacienda", source: "Ejemplo", ago: "ayer" },
];
