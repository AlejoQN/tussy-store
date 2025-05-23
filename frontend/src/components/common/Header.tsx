"use client";
import Link from "next/link";
import { useState } from "react";

const categorias = ["Hombre", "Mujer", "Niños", "Accesorios"];

export default function Header() {
  const [showCategorias, setShowCategorias] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow px-4 md:px-8 py-3 flex items-center justify-between z-50 relative">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <img src="/img/Logo-2.png" alt="Tussy Store" className="h-8 md:h-10" />
      </Link>
      {/* Hamburguesa móvil */}
      <button
        className="md:hidden text-2xl ml-auto"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Abrir menú"
      >
        ☰
      </button>
      {/* Navegación */}
      <nav
        className={`fixed md:static top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-lg md:bg-transparent md:shadow-none z-50 transition-transform duration-200
        ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 flex flex-col md:flex-row md:items-center gap-8 md:gap-8 text-black p-8 md:p-0`}
      >
        <button
          className="md:hidden text-2xl mb-8 self-end"
          onClick={() => setMenuOpen(false)}
          aria-label="Cerrar menú"
        >
          ×
        </button>
        <Link
          href="/"
          className="hover:text-primary font-medium"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        <div
          className="relative"
          onMouseEnter={() => setShowCategorias(true)}
          onMouseLeave={() => setShowCategorias(false)}
        >
          <Link
            href="/catalogo"
            className="hover:text-primary font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Catálogo
          </Link>
          {/* Menú desplegable de categorías */}
          {(showCategorias || menuOpen) && (
            <div className="absolute left-0 top-full bg-white shadow rounded mt-2 min-w-[180px] hidden md:block">
              {categorias.map((cat) => (
                <Link
                  key={cat}
                  href={`/catalogo?categoria=${encodeURIComponent(cat)}`}
                  className="block px-4 py-2 hover:bg-primary/10"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
          {/* Categorías en menú móvil */}
          {menuOpen && (
            <div className="block md:hidden mt-2">
              {categorias.map((cat) => (
                <Link
                  key={cat}
                  href={`/catalogo?categoria=${encodeURIComponent(cat)}`}
                  className="block px-4 py-2 hover:bg-primary/10"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link
          href="/about"
          className="hover:text-primary font-medium"
          onClick={() => setMenuOpen(false)}
        >
          Sobre Nosotros
        </Link>
      </nav>
      {/* Acciones */}
      <div className="hidden md:flex items-center gap-4">
        <button className="text-xl hover:text-primary" title="Buscar">
          <span role="img" aria-label="Buscar">
            🔍
          </span>
        </button>
        <Link
          href="/favoritos"
          className="text-xl hover:text-primary"
          title="Favoritos"
        >
          <span role="img" aria-label="Favoritos">
            🤍
          </span>
        </Link>
        <Link
          href="/cart"
          className="text-xl hover:text-primary"
          title="Carrito"
        >
          <span role="img" aria-label="Carrito">
            🛒
          </span>
        </Link>
        <Link
          href="/login"
          className="ml-2 px-4 py-1 border rounded hover:bg-pink-400 transition text-black"
        >
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
}
