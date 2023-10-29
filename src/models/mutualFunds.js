const mongoose = require("mongoose");

const mutualFundSchema = new mongoose.Schema({
    fundName: {
      type: String,
      required: true,
    },
    fundManager: {
      type: String,
      required: true,
    },
    nav: {
      type: Number,
      required: true,
    },
    investmentAmount: {
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
