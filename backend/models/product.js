const { pool } = require("../config/database");

class Product {
  constructor({
    id,
    nombre,
    descripcion,
    precio,
    tallas,
    colores,
    stock,
    categoria_id,
    subcategoria_id,
  }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.tallas = typeof tallas === "string" ? JSON.parse(tallas) : tallas;
    this.colores = typeof colores === "string" ? JSON.parse(colores) : colores;
    this.stock = stock;
    this.categoria_id = categoria_id;
    this.subcategoria_id = subcategoria_id;
  }

  applyDiscount(percentage) {
    if (typeof percentage !== "number" || percentage <= 0 || percentage >= 100) {
      throw new Error("Porcentaje inválido");
    }
    const discount = (this.precio * percentage) / 100;
    return +(this.precio - discount).toFixed(2);
  }

  checkStock() {
    return this.stock > 0;
  }

  static async getRelatedProducts(categoria_id, excludeId = null, limit = 4) {
    let query = "SELECT * FROM productos WHERE categoria_id = ?";
    const params = [categoria_id];
    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }
    query += " LIMIT ?";
    params.push(limit);

    const [rows] = await pool.query(query, params);
    return rows.map((row) => new Product(row));
  }
}

module.exports = Product;