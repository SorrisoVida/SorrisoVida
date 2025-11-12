const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    config.JWT_SECRET,
    { expiresIn: '8h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = { generateToken, verifyToken, decodeToken };