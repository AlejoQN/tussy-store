const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initDB() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log("Conexión a MySQL (pool) exitosa");
    connection.release();
  } catch (error) {
    console.error("Error al conectar a MySQL:", error.message);
    process.exit(1);
  }
}

module.exports = {
  pool,
  initDB,
};