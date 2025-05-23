const mercadopago = require("mercadopago");
const axios = require("axios");
const { pool } = require("../config/database");
const winston = require("winston");

// Configuración MercadoPago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// Logger de transacciones
const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: "logs/payments.log" })],
});

// 1. MercadoPago: Crear preferencia
exports.createMercadoPagoPreference = async (req, res) => {
  try {
    const { items, usuario_id } = req.body;
    const preference = {
      items: items.map((item) => ({
        title: item.nombre,
        quantity: item.cantidad,
        currency_id: "COP",
        unit_price: item.precio,
      })),
      back_urls: {
        success: `${process.env.FRONTEND_URL}/checkout/success`,
        failure: `${process.env.FRONTEND_URL}/checkout/failure`,
      },
      auto_return: "approved",
      metadata: { usuario_id },
    };
    const response = await mercadopago.preferences.create(preference);
    logger.info(`MercadoPago preference creada para usuario ${usuario_id}`);
    res.json({ init_point: response.body.init_point });
  } catch (err) {
    logger.error("Error creando preferencia MercadoPago", err);
    res.status(500).json({ error: "Error creando preferencia MercadoPago" });
  }
};

// 1b. MercadoPago: Webhook handler
exports.mercadoPagoWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;
    logger.info(`Webhook MercadoPago recibido: ${JSON.stringify(req.body)}`);
    if (type === "payment") {
      // Consultar pago
      const payment = await mercadopago.payment.findById(data.id);
      // Guardar en base de datos
      await pool.query(
        "INSERT INTO pagos (metodo, estado, monto) VALUES (?, ?, ?)",
        ["MercadoPago", payment.body.status, payment.body.transaction_amount]
      );
    }
    res.sendStatus(200);
  } catch (err) {
    logger.error("Error en webhook MercadoPago", err);
    res.sendStatus(500);
  }
};

// 2. Bancolombia: Generar QR dinámico (simulado)
exports.generateBancolombiaQR = async (req, res) => {
  try {
    const { monto, usuario_id } = req.body;
    // Simulación de generación de QR
    const qrData = `bancolombia://pay?amount=${monto}&ref=${Date.now()}&user=${usuario_id}`;
    logger.info(
      `QR Bancolombia generado para usuario ${usuario_id}, monto ${monto}`
    );
    res.json({
      qr: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        qrData
      )}`,
    });
  } catch (err) {
    logger.error("Error generando QR Bancolombia", err);
    res.status(500).json({ error: "Error generando QR Bancolombia" });
  }
};

// 3. Nequi: Validar transacción por API (simulado)
exports.validateNequiPayment = async (req, res) => {
  try {
    const { transactionId, usuario_id, monto } = req.body;
    // Simulación de validación con API Nequi
    // En producción, usar API real de Nequi
    const valid = transactionId && transactionId.startsWith("NEQ");
    logger.info(
      `Validación Nequi usuario ${usuario_id}, transacción ${transactionId}, monto ${monto}, resultado: ${valid}`
    );
    if (valid) {
      await pool.query(
        "INSERT INTO pagos (metodo, estado, monto) VALUES (?, ?, ?)",
        ["Nequi", "aprobado", monto]
      );
      res.json({ status: "aprobado" });
    } else {
      await pool.query(
        "INSERT INTO pagos (metodo, estado, monto) VALUES (?, ?, ?)",
        ["Nequi", "rechazado", monto]
      );
      res.status(400).json({ status: "rechazado" });
    }
  } catch (err) {
    logger.error("Error validando pago Nequi", err);
    res.status(500).json({ error: "Error validando pago Nequi" });
  }
};
