"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: number;
  producto_id: number;
  nombre: string;
  imagen: string;
  talla?: string;
  color?: string;
  precio: number;
  cantidad: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [envio, setEnvio] = useState(0);
  const [cupon, setCupon] = useState("");
  const [descuento, setDescuento] = useState(0);

  // Simulación de fetch del carrito (reemplaza por llamada real a API)
  useEffect(() => {
    // Aquí deberías hacer fetch a tu API: /api/cart
    // Ejemplo de datos simulados:
    const example: CartItem[] = [
      {
        id: 1,
        producto_id: 101,
        nombre: "Camiseta Tussy",
        imagen: "/img/camiseta.jpg",
        talla: "M",
        color: "Rojo",
        precio: 50000,
        cantidad: 2,
      },
      {
        id: 2,
        producto_id: 102,
        nombre: "Pantalón Classic",
        imagen: "/img/pantalon.jpg",
        talla: "32",
        color: "Azul",
        precio: 90000,
        cantidad: 1,
      },
    ];
    setItems(example);
  }, []);

  useEffect(() => {
    const sub = items.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
    setSubtotal(sub);
    setEnvio(sub > 150000 ? 0 : 10000); // Envío gratis desde $150.000
  }, [items]);

  const handleCupon = () => {
    // Simulación: CUPON10 da 10% de descuento
    if (cupon === "CUPON10") {
      setDescuento(0.1);
    } else {
      setDescuento(0);
      alert("Cupón inválido");
    }
  };

  const total = subtotal - subtotal * descuento + envio;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Lista de productos */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Tu carrito</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">El carrito está vacío.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex gap-4 items-center bg-white dark:bg-dark rounded shadow p-3"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-semibold">{item.nombre}</div>
                  <div className="text-sm text-gray-500">
                    Talla: {item.talla}{" "}
                    {item.color && <>| Color: {item.color}</>}
                  </div>
                  <div className="text-sm mt-1">
                    Precio:{" "}
                    <span className="font-bold">
                      ${item.precio.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm">Cantidad</span>
                  <input
                    type="number"
                    min={1}
                    value={item.cantidad}
                    className="w-14 border rounded px-2 py-1 text-center"
                    readOnly
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Resumen y cupones */}
      <div className="bg-white dark:bg-dark rounded shadow p-6 flex flex-col gap-4">
        <h3 className="text-xl font-bold mb-2">Resumen</h3>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span>{envio === 0 ? "Gratis" : `$${envio.toLocaleString()}`}</span>
        </div>
        {descuento > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Descuento</span>
            <span>-{(descuento * 100).toFixed(0)}%</span>
          </div>
        )}
        <hr />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toLocaleString()}</span>
        </div>
        {/* Cupones */}
        <div className="mt-2">
          <label className="block text-sm mb-1">Cupón de descuento</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={cupon}
              onChange={(e) => setCupon(e.target.value)}
              className="border rounded px-2 py-1 flex-1"
              placeholder="Ingresa tu cupón"
            />
            <button
              className="bg-primary text-white px-3 py-1 rounded hover:bg-secondary transition"
              onClick={handleCupon}
              type="button"
            >
              Aplicar
            </button>
          </div>
        </div>
        {/* Botón continuar */}
        <Link
          href="/checkout"
          className="mt-4 bg-secondary hover:bg-primary text-white font-semibold py-2 rounded text-center transition"
        >
          Continuar compra
        </Link>
      </div>
    </div>
  );
}
