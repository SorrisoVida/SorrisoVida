const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_FILE = path.join(__dirname, '../data/users.json');

let users = [];
try {
  const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
  users = JSON.parse(rawData);
} catch {
  users = [];
}

const saveUsers = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

const UserModel = {
  findAll: () => users,
  findById: (id) => users.find((u) => u.id === id),
  findByEmail: (email) => users.find((u) => u.email === email),
  create: (user) => {
    // Garante que a senha seja hasheada se não estiver
    const password = user.password.startsWith('$2a$') || user.password.startsWith('$2b$')
      ? user.password
      : bcrypt.hashSync(user.password, 8);

    const newUser = { id: users.length + 1, ...user, password };
    users.push(newUser);
    saveUsers();
    return newUser;
  },
  update: (id, updates) => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates };
    saveUsers();
    return users[index];
  },
  delete: (id) => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    saveUsers();
    return true;
  }
};

module.exports = UserModel;