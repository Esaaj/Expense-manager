const mongoose = require("mongoose");

const fdSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    maturityDate: {
      type: String,
      required: true,
    },
    depositDate: {
      type: String,
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
    compoundingFrequency: {
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

module.exports = mongoose.model("FD", fdSchema);
