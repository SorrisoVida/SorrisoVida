const express = require('express');
const UserModel = require('../models/user.model');
const { authenticateToken, adminOnly } = require('../middleware/auth.middleware');
const router = express.Router();

// GET /api/users - apenas admin
router.get('/', authenticateToken, adminOnly, (req, res) => {
	const users = UserModel.findAll();
	res.json({ users });
});

// POST /api/users - admin cria dentista/atendente
router.post('/', authenticateToken, adminOnly, (req, res) => {
	const { nome, email, password, role } = req.body;
	if (!nome || !email || !password || !role) {
		return res.status(400).json({ message: 'nome, email, senha e role são obrigatórios' });
	}
	const existing = UserModel.findByEmail(email);
	if (existing) return res.status(409).json({ message: 'Email já cadastrado' });
	const user = UserModel.create({ nome, email, password, role, status: 'ativo' });
	res.status(201).json({ user });
});

// GET /api/users/:id - admin ou próprio usuário
router.get('/:id', authenticateToken, (req, res) => {
	const { id } = req.params;
	const user = UserModel.findById(id);
	if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
	if (req.user.role !== 'admin' && req.user.id !== Number(id)) {
		return res.status(403).json({ message: 'Acesso negado' });
	}
	res.json({ user });
});

// PUT /api/users/:id - admin ou próprio usuário
router.put('/:id', authenticateToken, (req, res) => {
	const { id } = req.params;
	if (req.user.role !== 'admin' && req.user.id !== Number(id)) {
		return res.status(403).json({ message: 'Acesso negado' });
	}
	const update = req.body;
	const updated = UserModel.update(id, update);
	if (!updated) return res.status(404).json({ message: 'Usuário não encontrado' });
	res.json({ user: updated });
});

// DELETE /api/users/:id - admin only
router.delete('/:id', authenticateToken, adminOnly, (req, res) => {
	const { id } = req.params;
	const ok = UserModel.delete(id);
	if (!ok) return res.status(404).json({ message: 'Usuário não encontrado' });
	res.json({ message: 'Usuário removido' });
});

module.exports = router;

