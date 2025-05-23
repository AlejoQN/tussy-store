const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const { verifyToken } = require("../controllers/authController");

// 1. Añadir producto al carrito
router.post("/add", verifyToken, async (req, res) => {
  const { producto_id, cantidad = 1, talla, color } = req.body;
  const usuario_id = req.user.id;
  try {
    // Validar stock
    const [prodRows] = await pool.query(
      "SELECT stock FROM productos WHERE id = ?",
      [producto_id]
    );
    if (prodRows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });
    if (prodRows[0].stock < cantidad)
      return res.status(400).json({ error: "Stock insuficiente" });

    // Obtener o crear carrito
    let [carritoRows] = await pool.query(
      "SELECT id FROM carritos WHERE usuario_id = ?",
      [usuario_id]
    );
    let carrito_id;
    if (carritoRows.length === 0) {
      const [result] = await pool.query(
        "INSERT INTO carritos (usuario_id) VALUES (?)",
        [usuario_id]
      );
      carrito_id = result.insertId;
    } else {
      carrito_id = carritoRows[0].id;
    }

    // Verificar si el producto ya está en el carrito
    const [itemRows] = await pool.query(
      "SELECT id, cantidad FROM items_carrito WHERE carrito_id = ? AND producto_id = ? AND talla = ? AND color = ?",
      [carrito_id, producto_id, talla || null, color || null]
    );
    if (itemRows.length > 0) {
      // Actualizar cantidad
      const nuevaCantidad = itemRows[0].cantidad + cantidad;
      if (prodRows[0].stock < nuevaCantidad)
        return res.status(400).json({ error: "Stock insuficiente" });
      await pool.query("UPDATE items_carrito SET cantidad = ? WHERE id = ?", [
        nuevaCantidad,
        itemRows[0].id,
      ]);
    } else {
      // Insertar nuevo item
      await pool.query(
        "INSERT INTO items_carrito (carrito_id, producto_id, cantidad, talla, color) VALUES (?, ?, ?, ?, ?)",
        [carrito_id, producto_id, cantidad, talla || null, color || null]
      );
    }
    res.json({ message: "Producto añadido al carrito" });
  } catch (err) {
    res.status(500).json({ error: "Error al añadir producto al carrito" });
  }
});

// 2. Cambiar cantidad de un producto en el carrito
router.put("/update/:id", verifyToken, async (req, res) => {
  const itemId = req.params.id;
  const { cantidad } = req.body;
  try {
    // Obtener item y validar existencia
    const [itemRows] = await pool.query(
      "SELECT producto_id FROM items_carrito WHERE id = ?",
      [itemId]
    );
    if (itemRows.length === 0)
      return res.status(404).json({ error: "Item no encontrado" });

    // Validar stock
    const [prodRows] = await pool.query(
      "SELECT stock FROM productos WHERE id = ?",
      [itemRows[0].producto_id]
    );
    if (prodRows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });
    if (prodRows[0].stock < cantidad)
      return res.status(400).json({ error: "Stock insuficiente" });

    await pool.query("UPDATE items_carrito SET cantidad = ? WHERE id = ?", [
      cantidad,
      itemId,
    ]);
    res.json({ message: "Cantidad actualizada" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar cantidad" });
  }
});

// 3. Obtener carrito actual
router.get("/", verifyToken, async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const [carritoRows] = await pool.query(
      "SELECT id FROM carritos WHERE usuario_id = ?",
      [usuario_id]
    );
    if (carritoRows.length === 0) return res.json({ items: [], total: 0 });

    const carrito_id = carritoRows[0].id;
    const [items] = await pool.query(
      `SELECT ic.id, ic.producto_id, ic.cantidad, ic.talla, ic.color, 
              p.nombre, p.precio, p.imagen
         FROM items_carrito ic
         JOIN productos p ON ic.producto_id = p.id
        WHERE ic.carrito_id = ?`,
      [carrito_id]
    );
    // Calcular total
    const total = items.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
    res.json({ items, total });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

// 4. Iniciar flujo de pago (checkout)
router.post("/checkout", verifyToken, async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const [carritoRows] = await pool.query(
      "SELECT id FROM carritos WHERE usuario_id = ?",
      [usuario_id]
    );
    if (carritoRows.length === 0)
      return res.status(400).json({ error: "Carrito vacío" });

    const carrito_id = carritoRows[0].id;
    const [items] = await pool.query(
      "SELECT producto_id, cantidad FROM items_carrito WHERE carrito_id = ?",
      [carrito_id]
    );
    if (items.length === 0)
      return res.status(400).json({ error: "Carrito vacío" });

    // Aquí puedes iniciar el flujo de pago (ejemplo: MercadoPago, etc.)
    // Por ahora, solo responde con los datos del carrito
    res.json({ message: "Checkout iniciado", items });
  } catch (err) {
    res.status(500).json({ error: "Error al iniciar checkout" });
  }
});

module.exports = router;
