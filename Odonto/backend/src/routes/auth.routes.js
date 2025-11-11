const express = require('express');
const AuthService = require('../services/auth.service');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/auth/google - login via Google (idToken)
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'idToken é obrigatório' });
    const result = await AuthService.googleLogin(idToken);
    return res.json(result);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
});

// POST /api/auth/register — registro público de pacientes apenas
router.post('/register', async (req, res) => {
  try {
    const { nome, email, password, cpf, telefone } = req.body;
    if (!nome || !email || !password || !cpf || !telefone) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    // força role paciente em registro público
    const role = 'paciente';
    const result = await AuthService.register(nome, email, password, role, cpf, telefone);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(409).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }
    const result = await AuthService.login(email, password);
    return res.json(result);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email é obrigatório' });
    }
    const result = await AuthService.forgotPassword(email);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token e nova senha são obrigatórios' });
    }
    const result = await AuthService.resetPassword(token, newPassword);
    return res.json(result);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
});

// GET /api/auth/me — obter usuário atual
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;