const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5001;

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Привет из бэкенда!' });
});

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Тест' }]);
});

app.post('/api/echo', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Поле "text" обязательно' });
  }
  res.json({
    original: text,
    reversed: text.split('').reverse().join('')
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер слушает http://localhost:${PORT}`);
});