const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const User = require('./models/User');
const app = express();
const branchRoutes = require('./routes/branches');
const partnerRoutes = require('./routes/partners');

app.use(express.json());
app.use('/api/branches', branchRoutes);
app.use('/api/partners', partnerRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'tourism_secret_key', resave: false, saveUninitialized: true }));

mongoose.connect("mongodb+srv://oasistravel:151293@cluster0.m18boxf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    req.session.user = {
      username: user.username,
      role: user.role
    };
    res.json({ success: true, role: user.role });
  } else {
    res.json({ success: false, message: 'بيانات الدخول غير صحيحة' });
  }
});

app.get('/api/dashboard-summary', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const Reservation = require('./models/Customer');
    const Invoice = require('./models/Invoice');
    const Room = require('./models/Room');

    const todayReservations = await Reservation.countDocuments({
      travelDate: { $gte: today, $lt: tomorrow }
    });

    const invoiceCount = await Invoice.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const dailyRevenueData = await Invoice.aggregate([
      {
        $match: { createdAt: { $gte: today, $lt: tomorrow } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" }
        }
      }
    ]);
    const dailyRevenue = dailyRevenueData[0]?.total || 0;

    const roomsBooked = await Room.countDocuments({ booked: true });

    res.json({ todayReservations, invoiceCount, dailyRevenue, roomsBooked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/api/reservations', async (req, res) => {
  try {
    const Customer = require('./models/Customer');
const Reservation = require('./models/Reservation');
    const reservations = await Reservation.find({});
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching reservations' });
  }
});
app.delete('/api/reservations/:id', async (req, res) => {
  try {
    const Customer = require('./models/Customer');
const Reservation = require('./models/Reservation');
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});
app.get('/api/reservations/:id', async (req, res) => {
  try {
    const Customer = require('./models/Customer');
const Reservation = require('./models/Reservation');
    const reservation = await Reservation.findById(req.params.id);
    res.json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching reservation' });
  }
});

app.put('/api/reservations/:id', async (req, res) => {
  try {
    const Customer = require('./models/Customer');
const Reservation = require('./models/Reservation');
    await Reservation.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating reservation' });
  }
});
app.post('/api/reservations/check-seat', async (req, res) => {
  try {
    const { travelDate, seat } = req.body;
    const Customer = require('./models/Customer');
const Reservation = require('./models/Reservation');
    const exists = await Customer.findOne({ travelDate, seat });
    res.json({ taken: !!exists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error checking seat availability' });
  }
});
app.get('/api/invoices/:id', async (req, res) => {
  try {
    const Invoice = require('./models/Invoice');
    const invoice = await Invoice.findById(req.params.id);
    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching invoice' });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const { customer, count, travelDate, city, paid, seatNumber, transport } = req.body;
    const reservation = new Reservation({ customer, count, travelDate, city, paid, seatNumber, transport });
    await reservation.save();
    res.status(201).json({ message: 'تم حفظ الحجز بنجاح' });
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ أثناء حفظ الحجز' });
  }
});

// حجوزات الباص الكبير لليوم الحالي
app.get('/api/reservations/bus/today', async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const reservations = await Reservation.find({ travelDate: today, transport: "باص كبير" }).populate("customer");
    res.json(reservations.map(r => ({
      _id: r._id,
      seatNumber: r.seatNumber,
      customer: r.customer,
      city: r.city,
      travelDate: r.travelDate
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "فشل في تحميل حجوزات الباص الكبير" });
  }
});

// حجوزات الميني باص لليوم الحالي
app.get('/api/reservations/minibus/today', async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const reservations = await Reservation.find({ travelDate: today, transport: "ميني باص" }).populate("customer");
    res.json(reservations.map(r => ({
      _id: r._id,
      seatNumber: r.seatNumber,
      customer: r.customer,
      city: r.city,
      travelDate: r.travelDate
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "فشل في تحميل حجوزات الميني باص" });
  }
});

// API لجلب قائمة الفنادق
app.get('/api/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: 'فشل في تحميل قائمة الفنادق' });
  }
});

// API لجلب شارت الغرف حسب الفندق والتاريخ
app.get('/api/room-chart', async (req, res) => {
  try {
    const { hotelId, date } = req.query;
    const rooms = await Room.find({ hotel: hotelId });

    const reservations = await Reservation.find({
      travelDate: date,
      hotel: hotelId
    }).populate("customer");

    const result = rooms.map(room => {
      const booking = reservations.find(r => r.roomNumber === room.number);
      return {
        number: room.number,
        type: room.type,
        booked: !!booking,
        bookingId: booking?._id || null,
        customer: booking?.customer || null,
        checkIn: booking?.travelDate || null,
        checkOut: booking?.returnDate || null
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'فشل في تحميل شارت الغرف' });
  }
});

// API: إضافة غرفة جديدة
app.post('/api/rooms', async (req, res) => {
  try {
    const { number, type, hotel } = req.body;
    const room = new Room({ number, type, hotel });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: 'فشل في إضافة الغرفة' });
  }
});

// API: عرض كل الغرف
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find().populate('hotel');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'فشل في تحميل الغرف' });
  }
});

// API: حذف غرفة
app.delete('/api/rooms/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف الغرفة' });
  } catch (err) {
    res.status(500).json({ error: 'فشل في حذف الغرفة' });
  }
});

// API: تقرير الإيرادات اليومية
app.get('/api/report/income', async (req, res) => {
  try {
    const date = req.query.date;
    const bookings = await Reservation.find({ travelDate: date }).populate("customer");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "فشل في تحميل الإيرادات" });
  }
});

// API: تقرير المصروفات اليومية
app.get('/api/report/expenses', async (req, res) => {
  try {
    const date = req.query.date;
    const expenses = await Expense.find({ date: date });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "فشل في تحميل المصروفات" });
  }
});

// API: حفظ مصروف جديد
app.post('/api/expenses', async (req, res) => {
  try {
    const { category, amount, date, notes } = req.body;
    const expense = new Expense({ category, amount, date, notes });
    await expense.save();
    res.status(201).json({ message: 'تم حفظ المصروف بنجاح' });
  } catch (err) {
    res.status(500).json({ error: 'فشل في حفظ المصروف' });
  }
});

// API: الإيرادات الشهرية
app.get('/api/report/monthly-income', async (req, res) => {
  try {
    const { month, year } = req.query;
    const regex = new RegExp(`^${year}-${month}`);
    const bookings = await Reservation.find({ travelDate: { $regex: regex } }).populate("customer");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "فشل في تحميل الإيرادات الشهرية" });
  }
});

// API: المصروفات الشهرية
app.get('/api/report/monthly-expenses', async (req, res) => {
  try {
    const { month, year } = req.query;
    const regex = new RegExp(`^${year}-${month}`);
    const expenses = await Expense.find({ date: { $regex: regex } });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "فشل في تحميل المصروفات الشهرية" });
  }
});


// API: تسجيل الدخول
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    res.json({
      success: true,
      username: user.username,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// EMPLOYEE
app.post('/api/employees', async (req, res) => {
  const emp = new Employee(req.body);
  await emp.save();
  res.status(201).json(emp);
});
app.get('/api/employees', async (req, res) => {
  const emps = await Employee.find();
  res.json(emps);
});
app.delete('/api/employees/:id', async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ATTENDANCE
app.post('/api/attendance', async (req, res) => {
  const att = new Attendance(req.body);
  await att.save();
  res.status(201).json(att);
});
app.get('/api/attendance', async (req, res) => {
  const att = await Attendance.find().populate("employee");
  res.json(att);
});

// COMMISSIONS
app.post('/api/commissions', async (req, res) => {
  const c = new Commission(req.body);
  await c.save();
  res.status(201).json(c);
});
app.get('/api/commissions', async (req, res) => {
  const c = await Commission.find().populate("employee");
  res.json(c);
});

// SALARIES
app.get('/api/salaries', async (req, res) => {
  const employees = await Employee.find();
  const attendance = await Attendance.find();
  const commissions = await Commission.find();

  const salaries = employees.map(emp => {
    const empAtt = attendance.filter(a => a.employee.equals(emp._id));
    const empCom = commissions.filter(c => c.employee.equals(emp._id));
    const present = empAtt.filter(a => a.status === "حضور").length;
    const absent = empAtt.filter(a => a.status === "غياب").length;
    const commTotal = empCom.reduce((sum, c) => sum + c.amount, 0);
    const total = emp.salary + commTotal; // optional logic
    return {
      name: emp.name,
      base: emp.salary,
      present,
      absent,
      commission: commTotal,
      total
    };
  });

  res.json(salaries);
});

// CREATE
app.post('/api/companies', async (req, res) => {
  const company = new Company(req.body);
  await company.save();
  res.status(201).json(company);
});

// READ
app.get('/api/companies', async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
});

// UPDATE
app.put('/api/companies/:id', async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(company);
});

// DELETE
app.delete('/api/companies/:id', async (req, res) => {
  await Company.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// CREATE reservation with company
app.post('/api/reservations', async (req, res) => {
  try {
    const reservation = new Reservation({
      customer: req.body.customer,
      travelDate: req.body.travelDate,
      returnDate: req.body.returnDate,
      city: req.body.city,
      hotel: req.body.hotel,
      company: req.body.company, // 💼 شركة مرتبطة
      roomNumber: req.body.roomNumber,
      seatNumber: req.body.seatNumber,
      price: req.body.price,
      paid: req.body.paid,
      paymentMethod: req.body.paymentMethod,
      receiver: req.body.receiver,
      notes: req.body.notes
    });
    await reservation.save();
    res.status(201).json({ message: "تم حفظ الحجز" });
  } catch (err) {
    res.status(500).json({ error: "فشل في حفظ الحجز", details: err.message });
  }
});
// جلب عدد الحجوزات لكل شركة

// تقرير الحجوزات حسب اسم الشركة
app.get('/api/reservations/by-company', async (req, res) => {
  try {
    const result = await Reservation.aggregate([
      {
        $lookup: {
          from: "companies",
          localField: "company",
          foreignField: "_id",
          as: "companyInfo"
        }
      },
      { $unwind: "$companyInfo" },
      {
        $group: {
          _id: "$companyInfo.name",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    res.json(result.map(r => ({ company: r._id, count: r.count })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "فشل في تحميل البيانات" });
  }
});
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});

