module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '343772625583-nj5tc61uc40sv75nqvbjig6hdq2bgfdq.apps.googleusercontent.com',
  EMAIL_USER: process.env.EMAIL_USER || 'seu-email@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'sua-senha-app',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:4200',
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000'
};