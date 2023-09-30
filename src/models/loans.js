const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const { interestType } = require('../helpers/enum');

const LoansSchema = new mongoose.Schema({
        userId: {
            type: ObjectId,
            ref: 'users',
            required: true,
        },
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        loanAmount: {
            type: Number,
        },
        startDate: {
            type: String,
        },
        interest:  {
            type: Number,
        },
        emi: {
            type: Number,
        },
        emiCompleted: {
            type: Number,
        },
        tenure: {
            type: Number,
        },
        interestType: {
            type: String,
            enum: interestType
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
    },
);

module.exports = mongoose.model('loans', LoansSchema);