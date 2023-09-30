const mongoose = require("mongoose");

const rdSchema = new mongoose.Schema({
  accountHolder: {
    type: String,
    required: true,
  },
  monthlyDeposit: {
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
  // Additional fields specific to RDs
  installmentTenure: {
    type: Number,
    required: true,
  },
  // ... other RD-specific fields
});

module.exports = mongoose.model("RD", rdSchema);
