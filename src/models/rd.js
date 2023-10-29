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
    removed: {
      isRemoved: {
          type: Boolean,
          default: false,
      },
      removedOn: {
          type: String,
          default: null,
      },
    }
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("RD", rdSchema);
