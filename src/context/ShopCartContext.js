// Carrito de la Tienda: lo comparten la pantalla de la tienda y el botón amarillo del menú (que muestra la cantidad
// y, estando en la tienda, abre el carrito desde abajo).
import React, { createContext, useContext, useMemo, useState } from "react";

const ShopCartContext = createContext(null);

export const ShopCartProvider = ({ children }) => {
  const [items, setItems] = useState({}); // id de producto → cantidad
  const [open, setOpen] = useState(false);

  const value = useMemo(() => {
    const change = (id, delta) =>
      setItems((c) => {
        const n = Math.max(0, Math.min(50, (c[id] || 0) + delta));
        const next = { ...c, [id]: n };
        if (!n) delete next[id];
        return next;
      });
    return {
      items,
      count: Object.values(items).reduce((s, n) => s + n, 0),
      change,
      clear: () => setItems({}),
      open,
      setOpen,
    };
  }, [items, open]);

  return <ShopCartContext.Provider value={value}>{children}</ShopCartContext.Provider>;
};

export const useShopCart = () => useContext(ShopCartContext);
