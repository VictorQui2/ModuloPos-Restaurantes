import { useState } from "react";

export function useCarrito() {
  const [items, setItems] = useState([]);

  const agregar = (producto) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.id === producto.id);
      if (existe) return prev.map((i) => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const quitar = (id) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.id === id);
      if (existe?.cantidad === 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i);
    });
  };

  const limpiar = () => setItems([]);

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  return { items, agregar, quitar, limpiar, total };
}
