import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#181818] text-white py-10 px-4 md:px-6 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
        {/* Logo y contacto */}
        <div>
          <img
            src="/img/Logo-2.png"
            alt="Tussy Store"
            className="h-14 md:h-16 mb-4"
          />
          <p className="text-base mb-3">Tienda online de ropa y accesorios.</p>
          <div className="flex gap-3 mt-3">
            <a
              href="https://instagram.com/tussystore"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/img/Instagram-Logo.png" alt="Instagram" className="h-8" />
            </a>
            <a
              href="https://tiktok.com/@tussystore"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/img/Tiktok-Logo.png" alt="TikTok" className="h-10" />
            </a>
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/img/whatsapp-Logo.png" alt="WhatsApp" className="h-8" />
            </a>
          </div>
        </div>
        {/* Información */}
        <div>
          <h4 className="font-bold mb-3 text-lg">Información</h4>
          <ul className="text-base space-y-2">
            <li>
              <Link href="/entrega" className="hover:underline">
                Información de entrega
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className="hover:underline">
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link href="/terminos" className="hover:underline">
                Términos y condiciones
              </Link>
            </li>
          </ul>
        </div>
        {/* Métodos de pago */}
        <div>
          <h4 className="font-bold mb-3 text-lg">Métodos de pago</h4>
          <div className="flex gap-3 items-center flex-wrap">
            <img src="/img/Mercadopago.png" alt="MercadoPago" className="h-14" />
            <img
              src="/img/Bancolombia-Logo.png"
              alt="Bancolombia"
              className="h-14"
            />
            <img src="/img/Nequi-Logo.png" alt="Nequi" className="h-14" />
          </div>
        </div>
        {/* Suscripción */}
        <div>
          <h4 className="font-bold mb-3 text-lg">¡Recibe ofertas!</h4>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Tu correo"
              className="px-3 py-2 rounded text-black text-base"
            />
            <button
              type="submit"
              className="bg-primary text-white px-3 py-2 rounded text-base font-semibold"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </div>
      <div className="text-center text-sm mt-10 opacity-80">
        © {new Date().getFullYear()} Tussy Store. Todos los derechos reservados.
      </div>
    </footer>
  );
}
