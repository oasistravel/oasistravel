// models/Hotel.js
const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: String,
  city: String,
  stars: Number,
  roomsCount: Number
}, { timestamps: true });

module.exports = mongoose.model("Hotel", hotelSchema);
