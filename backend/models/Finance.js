
const mongoose = require('mongoose');
const FinanceSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  description: String,
  date: String
});
module.exports = mongoose.model('Finance', FinanceSchema);
