const jwt = require("jsonwebtoken");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

// 1. Middleware para validar JWT en cookies (httpOnly, secure)
function jwtCookieAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Token requerido" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
}

// 2. Middleware para sanitizar inputs contra XSS
const xssSanitizer = xss();

// 3. Limitar intentos de login (5 intentos/hora/IP)
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  message: "Demasiados intentos de login, intenta más tarde.",
  keyGenerator: (req) => req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. Headers de seguridad: CSP, HSTS
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

module.exports = {
  jwtCookieAuth,
  xssSanitizer,
  loginLimiter,
  securityHeaders,
};