const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  etype: { type: String, required: true },
  hourlyrate: Number,
  totalHour: Number,
  total: Number,
  image:String,
});

const empModel = mongoose.model("Employee", employeeSchema);

module.exports = empModel;
