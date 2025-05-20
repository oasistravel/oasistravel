
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  travelDate: { type: String },
  returnDate: { type: String },
  city: { type: String },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  roomNumber: { type: String },
  transport: { type: String },
  seatNumber: { type: String },
  price: { type: Number },
  paid: { type: Number },
  paymentMethod: { type: String },
  receiver: { type: String },
  notes: { type: String },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // 💼 new field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', reservationSchema);
