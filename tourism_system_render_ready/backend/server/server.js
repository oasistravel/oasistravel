const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/tourism';

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/login', require('./routes/auth'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/stats', require('./routes/stats'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});