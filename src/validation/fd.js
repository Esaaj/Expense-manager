const mongoose = require("mongoose");

const fdSchema = new mongoose.Schema({
  accountHolder: {
    type: String,
    required: true,
  },
  principalAmount: {
    type: Number,
    required: true,
  },
  maturityDate: {
    type: Date,
    required: true,
  },
  interestRate: {
    type: Number,
    required: true,
  },
  lockInPeriod: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("FD", fdSchema);
