const { verifyToken } = require('../utils/jwt.util');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }

  req.user = decoded;
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado - apenas admin' });
  }
  next();
};

const employeeOnly = (req, res, next) => {
  if (!['admin', 'dentista', 'atendente'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Acesso negado - apenas funcionários' });
  }
  next();
};

module.exports = { authenticateToken, adminOnly, employeeOnly };