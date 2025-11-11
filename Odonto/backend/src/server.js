const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const config = require('./config/index'); 
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: config.FRONTEND_URL || '*' } });

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// rotas da aplicação
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Google OAuth client (usado no endpoint /api/auth/google caso queira validar aqui)
const googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);

// WebSocket para notificações de calendário
io.on('connection', (socket) => {
  console.log(`✅ Cliente conectado via WebSocket: ${socket.id}`);
  socket.on('disconnect', () => console.log(`❌ Cliente desconectado: ${socket.id}`));
});

// Endpoint para receber notificações do Google Calendar (push notifications)
app.post('/api/notifications', (req, res) => {
  const resourceState = req.headers['x-goog-resource-state'];
  console.log('📬 Notificação Google Calendar:', resourceState);

  // Canal de confirmação enviado pelo Google Calendar
  if (resourceState === 'sync') {
    console.log('✅ Canal confirmado');
    return res.status(200).send();
  }

  // Emite evento para clientes conectados via websocket
  io.emit('calendar-update', { message: 'Calendário foi atualizado!', state: resourceState, headers: req.headers });

  // responda 200 para o Google
  return res.status(200).send();
});

// (Opcional) endpoint local para validar idToken do Google e criar/retornar user
app.post('/api/auth/google-verify', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: 'idToken required' });
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    // aqui integre com seu UserModel / DB: buscar ou criar usuário
    // exemplo mínimo:
    const user = { id: payload.sub, nome: payload.name || payload.email, email: payload.email, role: 'paciente' };
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user });
  } catch (err) {
    console.error('google token verify err', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
});
// rota raiz
app.get('/', (req, res) => {
  res.send('Backend do SorrisoVida está funcionando!');
});

// health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', ts: new Date() }));

// iniciar servidor
server.listen(config.PORT || 3000, () => {
  console.log(`Backend rodando em http://localhost:${config.PORT || 3000}`);
});

module.exports = { app, server, io };
