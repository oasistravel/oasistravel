
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

mongoose.connect('mongodb+srv://oasistravel:151293@cluster0.m18boxf.mongodb.net')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Oasis Travel backend is working ✅');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
