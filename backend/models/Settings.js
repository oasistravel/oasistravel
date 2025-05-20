
const mongoose = require('mongoose');
const SettingsSchema = new mongoose.Schema({
  cities: [String],
  transports: [String],
  rooms: [String]
}, { collection: 'settings' });

module.exports = mongoose.model('Settings', SettingsSchema);
