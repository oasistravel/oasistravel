
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// ✅ الاتصال بقاعدة البيانات الجديدة
mongoose.connect("mongodb+srv://oasistours:151215@cluster3.fnawabu.mongodb.net/tourism", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB Atlas");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ موديل المستخدم
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});
const User = mongoose.model("User", userSchema);

// ✅ API لتسجيل الدخول
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ success: false, message: "بيانات غير صحيحة" });
  res.json({ success: true, username: user.username, role: user.role });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


// ✅ موديل المدن
const citySchema = new mongoose.Schema({
  name: String,
});
const City = mongoose.model("City", citySchema);

// ✅ موديل الفنادق
const hotelSchema = new mongoose.Schema({
  name: String,
  city: String,
  roomCount: Number
});
const Hotel = mongoose.model("Hotel", hotelSchema);

// ✅ موديل الحجوزات
const reservationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  city: String,
  hotel: String,
  arrivalDate: Date,
  departureDate: Date,
  peopleCount: Number,
  pricePerPerson: Number,
  total: Number,
  paid: Number,
  remaining: Number,
  paymentMethod: String,
  branch: String,
  company: String,
  receivedBy: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});
const Reservation = mongoose.model("Reservation", reservationSchema);

// ✅ API جلب المدن
app.get("/api/cities", async (req, res) => {
  const cities = await City.find({});
  res.json(cities);
});

// ✅ API جلب الفنادق في مدينة معينة
app.get("/api/hotels", async (req, res) => {
  const { city } = req.query;
  const hotels = await Hotel.find({ city });
  res.json(hotels);
});

// ✅ API إضافة حجز جديد
app.post("/api/reservations", async (req, res) => {
  try {
    const data = req.body;
    const reservation = new Reservation(data);
    await reservation.save();
    res.json({ success: true, message: "تم حفظ الحجز بنجاح" });
  } catch (err) {
    res.status(500).json({ success: false, message: "حدث خطأ أثناء حفظ الحجز", error: err });
  }
});


// ✅ API لجلب الحجوزات حسب تاريخ الرحلة
app.get("/api/reservations-by-date", async (req, res) => {
  const { date } = req.query;
  const dayStart = new Date(date);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  try {
    const reservations = await Reservation.find({
      arrivalDate: { $gte: dayStart, $lte: dayEnd }
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ success: false, message: "خطأ في جلب الحجوزات", error: err });
  }
});
app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({ success: true, reservations });
  } catch (err) {
    res.status(500).json({ success: false, message: "خطأ في جلب الحجوزات" });
  }
});
app.get("/api/reservation/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (reservation) {
      res.json({ success: true, reservation });
    } else {
      res.json({ success: false, message: "لم يتم العثور على الحجز" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "خطأ في جلب الحجز" });
  }
});
app.put("/api/reservation/:id", async (req, res) => {
  try {
    await Reservation.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true, message: "تم التحديث بنجاح" });
  } catch (err) {
    res.status(500).json({ success: false, message: "فشل التحديث" });
  }
});
