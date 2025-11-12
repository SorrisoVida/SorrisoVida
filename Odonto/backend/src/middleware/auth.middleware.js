const jwt = require('jsonwebtoken');
const config = require('../config/index');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido.' });
    }
    req.user = user;
    next();
  });
}

function authorizeRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado: você não tem permissão para este recurso.' });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };