// Cuentas de la calculadora del campo. 1 quintal = 100 kg; 10 qq = 1 tonelada.

/** "2,5" o "2.5" → 2.5; vacío o inválido → 0. */
export const num = (text) => {
  const n = parseFloat(String(text ?? "").trim().replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/** Cosecha: hectáreas × rinde (qq/ha) × precio ($/t). */
export const harvest = ({ hectares, yieldQq, pricePerTon, dollar }) => {
  const tons = (hectares * yieldQq) / 10;
  const total = tons * pricePerTon;
  return { tons, total, perHectare: hectares ? total / hectares : 0, usd: dollar ? total / dollar : 0 };
};

/** Cualquier cantidad a kg, quintales y toneladas. */
export const convert = (value, unit) => {
  const kg = value * { kg: 1, qq: 100, t: 1000 }[unit];
  return { kg, qq: kg / 100, t: kg / 1000 };
};

/** Cuánto hay que vender para juntar `amount` pesos, a un precio por unidad. */
export const toSell = (amount, unitPrice) => (unitPrice ? amount / unitPrice : 0);
