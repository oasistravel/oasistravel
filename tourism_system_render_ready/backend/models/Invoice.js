const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  service: String,
  description: String,
  quantity: Number,
  price: Number,
  discount: Number,
  noTax: Boolean,
  total: Number
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  type: String,
  clientType: String,
  companyName: String,
  groupName: String,
  name: String,
  phone: String,
  city: String,
  hotel: String,
  peopleCount: Number,
  paid: Number,
  remaining: Number,
  receiver: String,
  items: [invoiceItemSchema]
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
