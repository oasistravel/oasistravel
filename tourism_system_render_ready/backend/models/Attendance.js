
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['حضور', 'غياب'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
