
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
  action: String, // "حذف" - "تعديل" - "إضافة"
  performedBy: String, // اسم الموظف
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", logSchema);
