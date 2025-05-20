const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
  companyName: String,
  contactName: String,
  phone: String,
  email: String
});

module.exports = mongoose.model('Partner', PartnerSchema);