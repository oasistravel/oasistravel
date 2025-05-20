
const mongoose = require('mongoose');
const HRSchema = new mongoose.Schema({
  employee: String,
  date: String,
  status: String
});
module.exports = mongoose.model('HR', HRSchema);
