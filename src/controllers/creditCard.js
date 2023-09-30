const CreditCard = require('../models/creditCard');
const { validateCreditCard } = require('../validation/creditCard');
const Constants = require('../helpers/constants');

// Create a new credit card
const addCreditCard = (request, callback) => {
    const { userId } = request;
    const cardData = request.body;

    // Validate credit card data
    const { error } = validateCreditCard(cardData);
    if (error) {
        const response = {
            status: Constants.STATUS_CODE.BAD_REQUEST,
            msg: error.details[0].message,
        };
        return callback(response, null);
    }

    cardData.userId = userId;

    CreditCard.create(cardData, (err, newCard) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, newCard);
    });
};

// Get all credit cards for a user
const getCreditCards = (request, callback) => {
    const { userId } = request;

    const query = {
        userId,
        'removed.isRemoved': false,
    };

    CreditCard.find(query, (err, cards) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, cards);
    });
};

// Update an existing credit card
const updateCreditCard = (request, callback) => {
    const { cardId, ...rest } = request.body;
    const cardDetails = rest;

    // Validate credit card details
    const { error } = validateCreditCard(cardDetails);
    if (error) {
        const response = {
            status: Constants.STATUS_CODE.BAD_REQUEST,
            msg: error.details[0].message,
        };
        return callback(response, null);
    }

    CreditCard.findByIdAndUpdate(cardId, cardDetails, { new: true }, (err, updatedCard) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, updatedCard);
    });
};

// Delete a credit card
const deleteCreditCard = (request, callback) => {
    const { cardId } = request.body;
    const removed = {
        isRemoved: true,
        removedOn: new Date(),
    };

    CreditCard.findByIdAndUpdate(cardId, { $set: { removed } }, { new: true }, (err, updatedCard) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, updatedCard);
    });
};

module.exports = {
    addCreditCard,
    getCreditCards,
    updateCreditCard,
    deleteCreditCard,
};
