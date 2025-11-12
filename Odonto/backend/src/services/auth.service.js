const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');
const { generateToken } = require('../utils/jwt.util');
const MailService = require('./mail.service');

const AuthService = {
  // Registrar novo usuário
  register: async (nome, email, password, role = 'paciente', cpf, telefone) => {
    try {
      // verificar se email já existe
      const existingUser = UserModel.findByEmail(email);
      if (existingUser) {
        throw new Error('Email já registrado');
      }

      // Hash simplificado para aceitar senhas simples
      const hashedPassword = bcrypt.hashSync(password, 6); 

      // criar usuário
      const newUser = UserModel.create({
        nome,
        email,
        password: hashedPassword,
        cpf,
        telefone,
        role,
        status: 'ativo'
      });

      // depois configurar serviço de email para envio de boas-vindas
      // await MailService.sendWelcomeEmail(email, nome);

      // retornar token
      const token = generateToken(newUser.id, newUser.email, newUser.role);

      return {
        token,
        user: {
          id: newUser.id,
          nome: newUser.nome,
          email: newUser.email,
          role: newUser.role
        }
      };
    } catch (err) {
      throw new Error(`Erro ao registrar: ${err.message}`);
    }
  },

  // Login tradicional
  login: async (email, password) => {
    try {
      const user = UserModel.findByEmail(email);
      if (!user) {
        throw new Error('Email ou senha inválidos');
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Email ou senha inválidos');
      }

      const token = generateToken(user.id, user.email, user.role);

      return {
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role
        }
      };
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // Login via Google (idToken) — verifica token e cria/retorna usuário
  googleLogin: async (idToken) => {
    try {
      const { OAuth2Client } = require('google-auth-library');
      const config = require('../config');
      const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

      const ticket = await client.verifyIdToken({ idToken, audience: config.GOOGLE_CLIENT_ID });
      const payload = ticket.getPayload();
      const email = payload.email;
      const nome = payload.name || payload.given_name || 'Usuário Google';

      let user = UserModel.findByEmail(email);
      if (!user) {
        // criar paciente
        const randomPass = Math.random().toString(36).slice(-8);
        const hashed = bcrypt.hashSync(randomPass, 8);
        user = UserModel.create({ nome, email, password: hashed, role: 'paciente', status: 'ativo' });
        // opcional: enviar email de boas-vindas
        await MailService.sendWelcomeEmail(email, nome);
      }

      const token = generateToken(user.id, user.email, user.role);
      return { token, user: { id: user.id, nome: user.nome, email: user.email, role: user.role } };
    } catch (err) {
      throw new Error('Erro ao validar Google ID Token: ' + err.message);
    }
  },

  // Solicitar reset de senha
  forgotPassword: async (email) => {
    try {
      const user = UserModel.findByEmail(email);
      if (!user) {
        // não revelar se email existe (segurança)
        return { message: 'Se o email existe, um link de reset foi enviado' };
      }

      // gerar token temporário (simples, em produção usar crypto)
      const resetToken = Math.random().toString(36).substring(7);
      const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hora

      // armazenar token (em produção, salvar no DB)
      global.passwordResets = global.passwordResets || [];
      global.passwordResets.push({ email, resetToken, expiresAt });

      // enviar email
      const resetLink = `http://localhost:4200/auth/reset-password?token=${resetToken}`;
      await MailService.sendPasswordResetEmail(email, user.nome, resetLink);

      return { message: 'Se o email existe, um link de reset foi enviado' };
    } catch (err) {
      throw new Error(`Erro ao processar reset: ${err.message}`);
    }
  },

  // Confirmar novo password
  resetPassword: async (token, newPassword) => {
    try {
      global.passwordResets = global.passwordResets || [];
      const resetEntry = global.passwordResets.find(r => r.resetToken === token);

      if (!resetEntry) {
        throw new Error('Token inválido ou expirado');
      }

      if (new Date() > resetEntry.expiresAt) {
        global.passwordResets = global.passwordResets.filter(r => r.resetToken !== token);
        throw new Error('Token expirado');
      }

      // atualizar senha
      const hashedPassword = bcrypt.hashSync(newPassword, 8);
      const user = UserModel.findByEmail(resetEntry.email);
      UserModel.update(user.id, { password: hashedPassword });

      // remover token usado
      global.passwordResets = global.passwordResets.filter(r => r.resetToken !== token);

      return { message: 'Senha resetada com sucesso' };
    } catch (err) {
      throw new Error(err.message);
    }
  }
};

module.exports = AuthService;