const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  name: String,
  location: String,
  managerName: String
});

module.exports = mongoose.model('Branch', BranchSchema);