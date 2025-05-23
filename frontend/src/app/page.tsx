import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/products/ProductCard";

const masVendidos = [
  {
    nombre: "Gorra Gucci",
    imagen: "/img/Gucci.png",
    precio: 90000,
    descripcion: "Gorra con diseño exclusivo y materiales premium.",
    masVendido: true,
  },
  {
    nombre: "Camiseta Supreme",
    imagen: "/img/camiseta-supreme.png",
    precio: 250000,
    descripcion: "Camiseta edición limitada Supreme.",
    masVendido: true,
  },
  {
    nombre: "Tenis Luis guiton",
    imagen: "/img/zapatos.png",
    precio: 340000,
    descripcion: "Tenis de lujo para un estilo único.",
    masVendido: true,
  },
];

const interesantes = [
  {
    nombre: "Gorra Guffy",
    imagen: "/img/Goofy.png",
    precio: 90000,
    descripcion: "Gorra divertida con diseño de Guffy.",
  },
  {
    nombre: "Camiseta ;)",
    imagen: "/img/Camiseta-Roblox.png",
    precio: 95000,
    descripcion: "Camiseta con diseño popular.",
  },
  {
    nombre: "Tacones en estratosfera",
    imagen: "/img/Tacones.png",
    precio: 240000,
    descripcion: "Tacones de moda para ocasiones especiales.",
  },
  {
    nombre: "Pantalones de Mariamoda",
    imagen: "/img/Marimonda.png",
    precio: 64000,
    descripcion: "Pantalones de última tendencia.",
  },
  {
    nombre: "Pantalones 3 Piernas",
    imagen: "/img/Tres-piernas.png",
    precio: 180000,
    descripcion: "¡Atrévete a ser diferente!",
  },
  {
    nombre: "Tenis Estratosféricos",
    imagen: "/img/Teni.png",
    precio: 340000,
    descripcion: "Tenis con diseño innovador para destacar.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      {/* Banner principal */}
      <div className="w-full h-64 md:h-80 flex items-center justify-center mb-8">
        <img
          src="/img/Banner.png"
          alt="Banner Tussy Store"
          className="w-full h-full object-cover"
        />
      </div>
      <main className="flex-1 max-w-6xl mx-auto px-2 sm:px-4 py-8 w-full">
        {/* Bloque Lo más vendido */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Lo más vendido
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {masVendidos.map((prod, i) => (
              <ProductCard key={i} {...prod} />
            ))}
          </div>
        </section>
        {/* Bloque Prendas más interesantes */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Prendas más interesantes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {interesantes.map((prod, i) => (
              <ProductCard key={i} {...prod} />
            ))}
          </div>
        </section>
        {/* Banner inferior */}
      <div className="w-full h-40 md:h-56 flex items-center justify-center mt-8">
        <img
          src="/img/Banner.png"
          alt="Banner Tussy Store"
          className="w-full h-full object-cover"
        />
      </div>
      </main>
      <Footer />
    </div>
  );
}
