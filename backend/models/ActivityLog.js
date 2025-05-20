
const mongoose = require('mongoose');
const ActivityLogSchema = new mongoose.Schema({
  user: String,
  action: String,
  date: { type: Date, default: Date.now },
  details: String
});
module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
