const CreditCard = require('../models/creditCard');
const { validateCreditCard } = require('../validation/creditCard');
const Constants = require('../helpers/constants');
const Response = require('../helpers/responses'); // Import the Response module

async function addCreditCard(request, response) {
    try {
        const { userId } = request;
        const cardData = request.body;

        // Validate credit card data
        const { error } = validateCreditCard(cardData);
        if (error) {
            return Response.sendResponse(response, Constants.STATUS_CODE.BAD_REQUEST, error.details[0].message);
        }

        cardData.userId = userId;

        const newCard = await CreditCard.create(cardData);

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, newCard);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function getCreditCards(request, response) {
    try {
        const { userId } = request;

        const query = {
            userId,
            'removed.isRemoved': false,
        };

        const cards = await CreditCard.find(query);

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, cards);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function updateCreditCard(request, response) {
    try {
        const { cardId, ...rest } = request.body;
        const cardDetails = rest;

        // Validate credit card details
        const { error } = validateCreditCard(cardDetails);
        if (error) {
            return Response.sendResponse(response, Constants.STATUS_CODE.BAD_REQUEST, error.details[0].message);
        }

        const updatedCard = await CreditCard.findByIdAndUpdate(cardId, cardDetails, { new: true });

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedCard);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function deleteCreditCard(request, response) {
    try {
        const { cardId } = request.body;
        const removed = {
            isRemoved: true,
            removedOn: new Date(),
        };

        const updatedCard = await CreditCard.findByIdAndUpdate(cardId, { $set: { removed } }, { new: true });

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedCard);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = {
    addCreditCard,
    getCreditCards,
    updateCreditCard,
    deleteCreditCard,
};