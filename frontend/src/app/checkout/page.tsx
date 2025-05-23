"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type AddressForm = {
  nombre: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  telefono: string;
};

type MetodoPago = "mercadopago" | "bancolombia" | "nequi";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<AddressForm | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("mercadopago");
  const [isPaying, setIsPaying] = useState(false);

  // Simulación de datos de carrito
  const cart = [
    { nombre: "Camiseta Tussy", cantidad: 2, precio: 50000 },
    { nombre: "Pantalón Classic", cantidad: 1, precio: 90000 },
  ];
  const subtotal = cart.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );
  const envio = subtotal > 150000 ? 0 : 10000;
  const total = subtotal + envio;

  // Paso 1: Dirección
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>();

  const onSubmitAddress = (data: AddressForm) => {
    setAddress(data);
    setStep(2);
  };

  // Paso 2: Selección de método de pago
  const handlePago = () => setStep(3);

  // Paso 3: Confirmación y pago
  const handlePagarAhora = () => {
    setIsPaying(true);
    // Aquí iría la integración real con la pasarela de pago
    setTimeout(() => {
      alert("¡Pago realizado con éxito!");
      setIsPaying(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      <div className="flex gap-2 mb-8">
        <StepIndicator active={step === 1}>Dirección</StepIndicator>
        <StepIndicator active={step === 2}>Pago</StepIndicator>
        <StepIndicator active={step === 3}>Confirmación</StepIndicator>
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmit(onSubmitAddress)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nombre completo</label>
            <input
              {...register("nombre", { required: "Campo requerido" })}
              className="border rounded px-3 py-2 w-full"
            />
            {errors.nombre && (
              <span className="text-red-600 text-sm">
                {errors.nombre.message}
              </span>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Dirección</label>
            <input
              {...register("direccion", { required: "Campo requerido" })}
              className="border rounded px-3 py-2 w-full"
            />
            {errors.direccion && (
              <span className="text-red-600 text-sm">
                {errors.direccion.message}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Ciudad</label>
              <input
                {...register("ciudad", { required: "Campo requerido" })}
                className="border rounded px-3 py-2 w-full"
              />
              {errors.ciudad && (
                <span className="text-red-600 text-sm">
                  {errors.ciudad.message}
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Departamento</label>
              <input
                {...register("departamento", { required: "Campo requerido" })}
                className="border rounded px-3 py-2 w-full"
              />
              {errors.departamento && (
                <span className="text-red-600 text-sm">
                  {errors.departamento.message}
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Teléfono</label>
            <input
              {...register("telefono", {
                required: "Campo requerido",
                minLength: 7,
              })}
              className="border rounded px-3 py-2 w-full"
            />
            {errors.telefono && (
              <span className="text-red-600 text-sm">
                {errors.telefono.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded font-semibold mt-2"
          >
            Continuar
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-2">Selecciona método de pago</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="metodoPago"
                  checked={metodoPago === "mercadopago"}
                  onChange={() => setMetodoPago("mercadopago")}
                />
                <span>MercadoPago</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="metodoPago"
                  checked={metodoPago === "bancolombia"}
                  onChange={() => setMetodoPago("bancolombia")}
                />
                <span>Bancolombia</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="metodoPago"
                  checked={metodoPago === "nequi"}
                  onChange={() => setMetodoPago("nequi")}
                />
                <span>Nequi</span>
              </label>
            </div>
          </div>
          <div>
            {/* Aquí puedes renderizar componentes específicos por método */}
            {metodoPago === "mercadopago" && (
              <div className="p-3 border rounded bg-muted">
                Pago seguro con MercadoPago
              </div>
            )}
            {metodoPago === "bancolombia" && (
              <div className="p-3 border rounded bg-muted">
                Transferencia Bancolombia (QR o cuenta)
              </div>
            )}
            {metodoPago === "nequi" && (
              <div className="p-3 border rounded bg-muted">
                Pago con Nequi (QR o número)
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="bg-muted px-6 py-2 rounded"
              onClick={() => setStep(1)}
              type="button"
            >
              Atrás
            </button>
            <button
              className="bg-primary text-white px-6 py-2 rounded font-semibold"
              onClick={handlePago}
              type="button"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h3 className="font-bold mb-2">Confirmación de orden</h3>
          <div className="border rounded p-4 bg-muted">
            <div className="mb-2">
              <span className="font-semibold">Enviado a:</span>
              <div>
                {address?.nombre} <br />
                {address?.direccion}, {address?.ciudad}, {address?.departamento}
                <br />
                Tel: {address?.telefono}
              </div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Método de pago:</span>{" "}
              {metodoPago === "mercadopago"
                ? "MercadoPago"
                : metodoPago === "bancolombia"
                ? "Bancolombia"
                : "Nequi"}
            </div>
            <div>
              <span className="font-semibold">Productos:</span>
              <ul className="list-disc ml-6">
                {cart.map((item, i) => (
                  <li key={i}>
                    {item.nombre} x{item.cantidad} - $
                    {item.precio.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>
                  {envio === 0 ? "Gratis" : `$${envio.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-muted px-6 py-2 rounded"
              onClick={() => setStep(2)}
              type="button"
              disabled={isPaying}
            >
              Atrás
            </button>
            <button
              className="bg-primary text-white px-6 py-2 rounded font-semibold"
              onClick={handlePagarAhora}
              disabled={isPaying}
              type="button"
            >
              {isPaying ? "Procesando..." : "Pagar ahora"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepIndicator({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`px-4 py-2 rounded-full font-semibold text-sm ${
        active ? "bg-primary text-white" : "bg-muted text-gray-600"
      }`}
    >
      {children}
    </div>
  );
}
