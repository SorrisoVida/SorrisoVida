# Sorriso Vida - Backend

Este é o backend da aplicação Sorriso Vida, desenvolvido em Node.js com Express. Ele é responsável por gerenciar a autenticação de usuários, agendamentos, notificações e toda a lógica de negócio da clínica.

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express.js**: Framework para construção de APIs REST.
- **Socket.IO**: Para comunicação em tempo real (notificações de calendário).
- **JSON Web Tokens (JWT)**: Para autenticação segura baseada em tokens.
- **bcryptjs**: Para hashing de senhas.
- **Simulação de Banco de Dados**: Os dados são persistidos em arquivos JSON locais (`/src/data/*.json`) para simplicidade.

## ⚙️ Configuração do Ambiente

1.  **Instale as dependências:**
    Navegue até a pasta `Odonto/backend` e execute:
    ```bash
    npm install
    ```

2.  **Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do diretório `backend` ou configure as variáveis diretamente. Você pode usar o arquivo `src/config/index.js` como referência.

    Exemplo de `.env`:
    ```env
    PORT=3000
    JWT_SECRET=sua-chave-secreta-super-segura
    FRONTEND_URL=http://localhost:4200
    ```

3.  **Inicie o servidor:**
    Para iniciar o servidor em modo de desenvolvimento (com recarregamento automático usando `nodemon`), execute:
    ```bash
    npm run dev
    ```
    Ou para iniciar em modo de produção:
    ```bash
    npm start
    ```
    O servidor estará rodando em `http://localhost:3000` (ou na porta definida em `PORT`).

## 📝 Endpoints da API

A seguir, uma lista dos principais endpoints disponíveis:

### Autenticação (`/api/auth`)
- `POST /register`: Registra um novo usuário (paciente).
- `POST /login`: Autentica um usuário com email e senha.
- `POST /forgot-password`: (Placeholder) Rota para funcionalidade de recuperação de senha.

### Usuários (`/api/users`)
- `GET /`: Retorna uma lista de todos os usuários (requer autenticação de `admin` ou `atendente`).
- `POST /`: Cria um novo usuário (requer autenticação e permissões específicas de `admin` ou `atendente`).

### Agendamentos (`/api/appointments`)
- `GET /`: Retorna todos os agendamentos.
- `POST /`: Cria um novo agendamento (requer autenticação).
- `GET /patient/:patientId`: Retorna os agendamentos de um paciente específico.

### Utilitários
- `GET /api/professionals`: Retorna uma lista de usuários com o perfil "dentista".
- `GET /api/available-times`: Retorna os horários disponíveis para um profissional em uma data específica.
- `POST /api/notifications`: Webhook para receber notificações push do Google Calendar.
- `GET /api/health`: Endpoint de verificação de saúde do serviço.

## 🔌 WebSockets

O servidor utiliza Socket.IO para notificar os clientes conectados sobre atualizações no calendário em tempo real através do evento `calendar-update`.