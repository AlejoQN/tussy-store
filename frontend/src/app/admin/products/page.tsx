"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tallas: string;
  colores: string;
  stock: number;
  categoria_id: number;
  categoria_nombre?: string;
  imagen?: string;
};

type Categoria = {
  id: number;
  nombre: string;
};

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtros, setFiltros] = useState({
    nombre: "",
    categoria: "",
    stock: "",
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editProducto, setEditProducto] = useState<Producto | null>(null);
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  // Fetch categorías
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/categorias`)
      .then((res) => setCategorias(res.data))
      .catch(() => {});
  }, []);

  // Fetch productos con filtros y paginación
  useEffect(() => {
    const params: any = {
      page,
      pageSize: PAGE_SIZE,
      ...filtros,
    };
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/productos`, { params })
      .then((res) => {
        setProductos(res.data.items);
        setTotal(res.data.total);
      })
      .catch(() => {});
  }, [filtros, page]);

  // Imagen preview
  useEffect(() => {
    if (imagenes.length === 0) {
      setPreview([]);
      return;
    }
    const urls = imagenes.map((file) => URL.createObjectURL(file));
    setPreview(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [imagenes]);

  // Filtros
  const handleFiltro = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
    setPage(1);
  };

  // Abrir modal para editar
  const openEdit = (producto: Producto) => {
    setEditProducto(producto);
    setShowModal(true);
    setImagenes([]);
  };

  // Guardar producto editado
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProducto) return;
    // Subir imágenes si hay
    let imagenUrl = editProducto.imagen;
    if (imagenes.length > 0) {
      const formData = new FormData();
      imagenes.forEach((img) => formData.append("imagenes", img));
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/productos/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      imagenUrl = res.data.urls[0]; // Solo la primera para preview
    }
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/productos/${editProducto.id}`,
      {
        ...editProducto,
        imagen: imagenUrl,
      }
    );
    setShowModal(false);
    setEditProducto(null);
    setImagenes([]);
    // Refrescar productos
    const params: any = { page, pageSize: PAGE_SIZE, ...filtros };
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/productos`,
      { params }
    );
    setProductos(res.data.items);
    setTotal(res.data.total);
  };

  // Exportar a CSV
  const exportCSV = () => {
    const header = [
      "ID",
      "Nombre",
      "Descripción",
      "Precio",
      "Tallas",
      "Colores",
      "Stock",
      "Categoría",
    ];
    const rows = productos.map((p) => [
      p.id,
      p.nombre,
      p.descripcion,
      p.precio,
      p.tallas,
      p.colores,
      p.stock,
      categorias.find((c) => c.id === p.categoria_id)?.nombre || "",
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "productos.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Tabla paginada
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <button
          className="bg-accent text-white px-4 py-2 rounded"
          onClick={exportCSV}
        >
          Exportar a CSV
        </button>
      </div>
      {/* Filtros */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          name="nombre"
          placeholder="Buscar por nombre"
          value={filtros.nombre}
          onChange={handleFiltro}
          className="border rounded px-2 py-1"
        />
        <select
          name="categoria"
          value={filtros.categoria}
          onChange={handleFiltro}
          className="border rounded px-2 py-1"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        <select
          name="stock"
          value={filtros.stock}
          onChange={handleFiltro}
          className="border rounded px-2 py-1"
        >
          <option value="">Stock</option>
          <option value="0">Sin stock</option>
          <option value="1">Con stock</option>
        </select>
      </div>
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-dark rounded shadow">
          <thead>
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Imagen</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Tallas</th>
              <th className="p-2">Colores</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Categoría</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.id}</td>
                <td className="p-2">
                  {p.imagen && (
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-2">{p.nombre}</td>
                <td className="p-2">{p.descripcion}</td>
                <td className="p-2">${p.precio.toLocaleString()}</td>
                <td className="p-2">{p.tallas}</td>
                <td className="p-2">{p.colores}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">
                  {categorias.find((c) => c.id === p.categoria_id)?.nombre ||
                    ""}
                </td>
                <td className="p-2">
                  <button
                    className="bg-primary text-white px-2 py-1 rounded"
                    onClick={() => openEdit(p)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-6 text-gray-500">
                  No hay productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <div className="flex gap-2 mt-4 justify-end">
        <button
          className="px-3 py-1 rounded border"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Anterior
        </button>
        <span>
          Página {page} de {Math.ceil(total / PAGE_SIZE) || 1}
        </span>
        <button
          className="px-3 py-1 rounded border"
          disabled={page * PAGE_SIZE >= total}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente
        </button>
      </div>
      {/* Modal editar */}
      {showModal && editProducto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark rounded-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-2xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">Editar producto</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                placeholder="Nombre"
                value={editProducto.nombre}
                onChange={(e) =>
                  setEditProducto({ ...editProducto, nombre: e.target.value })
                }
                required
              />
              <textarea
                className="border rounded px-2 py-1 w-full"
                placeholder="Descripción"
                value={editProducto.descripcion}
                onChange={(e) =>
                  setEditProducto({
                    ...editProducto,
                    descripcion: e.target.value,
                  })
                }
                required
              />
              <input
                type="number"
                className="border rounded px-2 py-1 w-full"
                placeholder="Precio"
                value={editProducto.precio}
                onChange={(e) =>
                  setEditProducto({
                    ...editProducto,
                    precio: Number(e.target.value),
                  })
                }
                required
              />
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                placeholder="Tallas (ej: S,M,L)"
                value={editProducto.tallas}
                onChange={(e) =>
                  setEditProducto({ ...editProducto, tallas: e.target.value })
                }
              />
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                placeholder="Colores (ej: Rojo,Azul)"
                value={editProducto.colores}
                onChange={(e) =>
                  setEditProducto({ ...editProducto, colores: e.target.value })
                }
              />
              <input
                type="number"
                className="border rounded px-2 py-1 w-full"
                placeholder="Stock"
                value={editProducto.stock}
                onChange={(e) =>
                  setEditProducto({
                    ...editProducto,
                    stock: Number(e.target.value),
                  })
                }
                required
              />
              <select
                className="border rounded px-2 py-1 w-full"
                value={editProducto.categoria_id}
                onChange={(e) =>
                  setEditProducto({
                    ...editProducto,
                    categoria_id: Number(e.target.value),
                  })
                }
                required
              >
                <option value="">Selecciona categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              {/* Upload imágenes */}
              <div>
                <label className="block mb-1">Imágenes</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setImagenes(
                      e.target.files ? Array.from(e.target.files) : []
                    )
                  }
                />
                <div className="flex gap-2 mt-2">
                  {preview.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`preview-${i}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded font-semibold mt-2"
              >
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
