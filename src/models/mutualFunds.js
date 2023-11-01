const mongoose = require("mongoose");

const mutualFundSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    fundType: {
      type: String,
      required: true,
    },
    riskLevel: {
      type: String,
      required: true,
    },
    depositDate: {
      type: String,
      required: true,
    },
    currentReturns: {
      type: Number,
      required: true,
    },
    expectedReturns: {
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

module.exports = mongoose.model("mutualFunds", mutualFundSchema);
