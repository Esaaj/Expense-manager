const mongoose = require("mongoose");
const { transactionsType } = require('../helpers/enum');

const TransactionsSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'accounts',
            required: true,
        },
        description: {
            type: String,
        },
        category: {
            type: String,
        },
        type: {
            type: String,
            enum: transactionsType
        },
        amount: {
            type: Number,
        },
        date: {
            type: String,
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

module.exports = mongoose.model('transactions', TransactionsSchema);