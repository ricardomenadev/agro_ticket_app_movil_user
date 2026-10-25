// Datos de EJEMPLO para el rediseño: se reemplazan por el feed diario del servidor (precios y noticias).
// shortcut: datos fijos, hasta que exista /api/mobile/feed en el backend.

export const SAMPLE = true;

export const MARKETS = {
  updatedAt: "Ejemplo",
  grains: [
    { id: "soja", name: "Soja", place: "Rosario", price: null, change: 0, unit: "tn" },
    { id: "maiz", name: "Maíz", place: "Rosario", price: null, change: 0, unit: "tn" },
    { id: "girasol", name: "Girasol", place: "Rosario", price: null, change: 0, unit: "tn" },
    { id: "trigo", name: "Trigo", place: "Rosario", price: null, change: 0, unit: "tn" },
    { id: "sorgo", name: "Sorgo", place: "Rosario", price: null, change: 0, unit: "tn" },
  ],
  cattle: [
    { id: "novillo", name: "Novillo", place: "Cañuelas", price: null, change: 0, unit: "kg vivo" },
    { id: "vaquillona", name: "Vaquillona", place: "Cañuelas", price: null, change: 0, unit: "kg vivo" },
    { id: "ternero", name: "Ternero", place: "Cañuelas", price: null, change: 0, unit: "kg vivo" },
  ],
};

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
