const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const CreditCardSchema = new mongoose.Schema({
        userId: {
            type: ObjectId,
            ref: 'users',
            required: true,
        },
        name: {
            type: String,
        },
        bankName: {
            type: String,
        },
        limitAmount: {
            type: Number,
        },
        billDate: {
            type: String,
        },
        paymentDate: {
            type: String,
        },
        currentOutstanding:  {
            type: Number,
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

module.exports = mongoose.model('creditCard', CreditCardSchema);