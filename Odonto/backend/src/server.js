const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const http = require('http');
const socketIo = require('socket.io');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRole } = require('./middleware/auth.middleware');

// Simulação de banco de dados
const fs = require('fs');
const path = require('path');
const appointmentsDbPath = path.join(__dirname, 'data', 'appointments.json');
const usersDbPath = path.join(__dirname, 'data', 'users.json');

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
// app.use('/api/users', userRoutes); 

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

// ===== ROTAS DE USUÁRIOS COM AUTENTICAÇÃO =====

// Rota para Admin e Atendente criarem usuários
app.post('/api/users', authenticateToken, authorizeRole(['admin', 'atendente']), (req, res) => {
  const { nome, email, password, role, cpf, telefone } = req.body;
  const creatorRole = req.user.role;

  if (!nome || !email || !password || !role) {
    return res.status(400).json({ message: 'Nome, email, senha e perfil são obrigatórios.' });
  }

  // Regra de negócio: Apenas admin pode criar dentista
  if (role === 'dentista' && creatorRole !== 'admin') {
    return res.status(403).json({ message: 'Apenas administradores podem cadastrar dentistas.' });
  }

  // Regra de negócio: Atendente só pode criar paciente
  if (creatorRole === 'atendente' && role !== 'paciente') {
    return res.status(403).json({ message: 'Atendentes podem cadastrar apenas pacientes.' });
  }

  fs.readFile(usersDbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao ler banco de dados de usuários.' });
    }
    const users = JSON.parse(data);

    if (users.find(u => u.email === email)) {
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 6);
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      nome,
      email,
      password: hashedPassword,
      role,
      cpf: cpf || null,
      telefone: telefone || null,
      status: 'ativo',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    fs.writeFile(usersDbPath, JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ message: 'Erro ao salvar novo usuário.' });
      // Retorna o usuário sem a senha
      const { password, ...userToReturn } = newUser;
      res.status(201).json(userToReturn);
    });
  });
});

// Rota para buscar todos os usuários (para preencher listas, como a de pacientes no agendamento)
app.get('/api/users', authenticateToken, authorizeRole(['admin', 'atendente']), (req, res) => {
  fs.readFile(usersDbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao ler dados de usuários.' });
    }
    const users = JSON.parse(data);
    // Remove a senha antes de enviar
    const usersWithoutPassword = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPassword);
  });
});

// ===== NOVAS ROTAS PARA AGENDAMENTO LOCAL =====

// Rota para buscar profissionais (dentistas)
app.get('/api/professionals', (req, res) => {
  fs.readFile(usersDbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao ler dados de usuários.' });
    }
    const users = JSON.parse(data);
    const professionals = users
      .filter(u => u.role === 'dentista')
      .map(p => ({ id: p.id, nome: p.nome }));
    res.json(professionals);
  });
});

// Rota para buscar agendamentos de um paciente específico
app.get('/api/appointments/patient/:patientId', authenticateToken, (req, res) => {
  const { patientId } = req.params;

  // Segurança: Garante que apenas o próprio paciente ou um funcionário possa ver as consultas
  if (req.user.role === 'paciente' && req.user.id !== Number(patientId)) {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  fs.readFile(appointmentsDbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao ler agendamentos.' });
    }
    const allAppointments = JSON.parse(data);
    const patientAppointments = allAppointments.filter(ap => ap.pacienteId === Number(patientId));
    res.json(patientAppointments);
  });
});

// Rota para buscar todos os agendamentos
app.get('/api/appointments', (req, res) => {
  fs.readFile(appointmentsDbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao ler agendamentos.' });
    }
    res.json(JSON.parse(data));
  });
});

// Rota para buscar horários disponíveis (Lógica real)
app.get('/api/available-times', (req, res) => {
  const { profissionalId, data } = req.query;
  if (!profissionalId || !data) {
    return res.status(400).json({ message: 'Profissional e data são obrigatórios.' });
  }

  // Horários de trabalho padrão (poderia vir do perfil do dentista no futuro)
  const workHours = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  fs.readFile(appointmentsDbPath, 'utf8', (err, appointmentsData) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao verificar horários.' });
    }
    const allAppointments = JSON.parse(appointmentsData);
    const bookedTimes = allAppointments
      .filter(ap => ap.profissionalId === Number(profissionalId) && ap.data === data)
      .map(ap => ap.horario);

    const availableTimes = workHours.filter(time => !bookedTimes.includes(time));
    res.json(availableTimes);
  });
});

// Rota para criar um novo agendamento
app.post('/api/appointments', authenticateToken, (req, res) => {
  fs.readFile(appointmentsDbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao ler agendamentos.' });
    }
    const appointments = JSON.parse(data);
    const newAppointmentData = req.body;

    // Validação de segurança: Paciente só pode agendar para si mesmo.
    if (req.user.role === 'paciente' && req.user.id !== newAppointmentData.pacienteId) {
      return res.status(403).json({ message: 'Você só pode agendar consultas para si mesmo.' });
    }

    const newAppointment = { id: Date.now(), ...newAppointmentData, status: 'agendado' };
    appointments.push(newAppointment);
    fs.writeFile(appointmentsDbPath, JSON.stringify(appointments, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ message: 'Erro ao salvar agendamento.' });
      res.status(201).json(newAppointment);
    });
  });
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
