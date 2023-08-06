const mongoose = require("mongoose");
const { accountType } = require('../helpers/enum');

const accountsSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        name: {
            type: String,
        },
        type: {
            type: String,
            enum: accountType,
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
    },
);

module.exports = mongoose.model('accounts', accountsSchema);