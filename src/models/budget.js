const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const BudgetSchema = new mongoose.Schema({
        userId: {
            type: ObjectId,
            ref: 'users',
            required: true,
        },
        name: {
            type: String,
        },
        limitAmount: {
            type: Number,
        },
        startDate: {
            type: String,
        },
        endDate: {
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

module.exports = mongoose.model('budgets', BudgetSchema);