
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true }, // نوع المصروف (إيجار، موظفين، بنزين، ...)
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
