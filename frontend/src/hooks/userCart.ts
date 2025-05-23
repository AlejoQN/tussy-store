import { useState, useEffect } from "react";
import axios from "axios";

export type CartItem = {
  id: number; // id del item en el carrito (puede ser generado localmente)
  producto_id: number;
  nombre: string;
  imagen: string;
  talla?: string;
  color?: string;
  precio: number;
  cantidad: number;
  stock: number;
};

const STORAGE_KEY = "tussy_cart";

function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function useUserCart(userToken?: string) {
  const [items, setItems] = useState<CartItem[]>(getStoredCart());

  // Persistencia en localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  // Sincronizar con backend al iniciar sesión
  useEffect(() => {
    if (userToken) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then((res) => {
          if (Array.isArray(res.data.items)) setItems(res.data.items);
        })
        .catch(() => {});
    }
  }, [userToken]);

  // 1. Añadir al carrito (validar stock)
  const addToCart = async (item: Omit<CartItem, "id">) => {
    // Validar stock con backend
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${item.producto_id}`
    );
    if (!data || data.stock < item.cantidad)
      throw new Error("Stock insuficiente");

    setItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.producto_id === item.producto_id &&
          i.talla === item.talla &&
          i.color === item.color
      );
      if (idx !== -1) {
        // Ya existe, sumar cantidad (sin pasar stock)
        const nuevaCantidad = Math.min(
          prev[idx].cantidad + item.cantidad,
          data.stock
        );
        const updated = [...prev];
        updated[idx] = { ...updated[idx], cantidad: nuevaCantidad };
        return updated;
      }
      // Nuevo item
      return [
        ...prev,
        {
          ...item,
          id: Date.now(),
          stock: data.stock,
        },
      ];
    });
  };

  // 2. Eliminar del carrito por ID
  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 3. Actualizar cantidad (no permitir <1 ni >stock)
  const updateQuantity = async (id: number, cantidad: number) => {
    if (cantidad < 1) return;
    const item = items.find((i) => i.id === id);
    if (!item) return;
    // Validar stock actual
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${item.producto_id}`
    );
    if (cantidad > data.stock) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, cantidad: Math.min(cantidad, data.stock) } : i
      )
    );
  };

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    setItems, // por si necesitas setear manualmente
  };
}
