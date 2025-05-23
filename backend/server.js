require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mysql = require("mysql2/promise");

const app = express();

// Seguridad y utilidades
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Conexión a MySQL
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};
let db;
mysql.createConnection(dbConfig)
  .then((connection) => {
    db = connection;
    console.log("Conexión a MySQL exitosa");
  })
  .catch((err) => {
    console.error("Error conectando a MySQL:", err.message);
    process.exit(1);
  });

// Ruta de salud
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Tussy Store API running" });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});