const nodemailer = require('nodemailer');
const config = require('../config');

// Configurar transportador
const transporter = nodemailer.createTransport({
  service: config.EMAIL_SERVICE,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS
  }
});

const MailService = {
  sendWelcomeEmail: async (email, nome) => {
    try {
      await transporter.sendMail({
        from: config.EMAIL_USER,
        to: email,
        subject: 'Bem-vindo ao SorrisoVida!',
        html: `
          <h2>Olá ${nome}!</h2>
          <p>Sua conta foi criada com sucesso no SorrisoVida.</p>
          <p>Clique <a href="${config.FRONTEND_URL}/auth/login">aqui</a> para fazer login.</p>
          <p>Att,<br/>Equipe SorrisoVida</p>
        `
      });
      console.log(`✅ Email de boas-vindas enviado para ${email}`);
    } catch (err) {
      console.error('❌ Erro ao enviar email de boas-vindas:', err.message);
    }
  },

  sendPasswordResetEmail: async (email, nome, resetLink) => {
    try {
      await transporter.sendMail({
        from: config.EMAIL_USER,
        to: email,
        subject: 'SorrisoVida - Reset de Senha',
        html: `
          <h2>Olá ${nome}!</h2>
          <p>Recebemos uma solicitação de reset de senha. Clique no link abaixo (válido por 1 hora):</p>
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Resetar Senha
          </a>
          <p>Se você não solicitou, ignore este email.</p>
          <p>Att,<br/>Equipe SorrisoVida</p>
        `
      });
      console.log(`✅ Email de reset enviado para ${email}`);
    } catch (err) {
      console.error('❌ Erro ao enviar email de reset:', err.message);
    }
  },

  sendNotificationEmail: async (email, subject, message) => {
    try {
      await transporter.sendMail({
        from: config.EMAIL_USER,
        to: email,
        subject,
        html: `
          <h2>${subject}</h2>
          <p>${message}</p>
          <p>Att,<br/>Equipe SorrisoVida</p>
        `
      });
      console.log(`✅ Email enviado para ${email}`);
    } catch (err) {
      console.error('❌ Erro ao enviar email:', err.message);
    }
  }
};

module.exports = MailService;