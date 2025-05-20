
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  number: { type: String, required: true }, // رقم الغرفة (مثلاً: 101)
  type: { type: String, enum: ['سنجل', 'دبل', 'تريبل'], required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  status: { type: String, default: 'available' }, // optional for future
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);
