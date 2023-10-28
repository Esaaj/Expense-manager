const express = require('express');
const router = express.Router();
const creditCard = require('../controllers/creditCard');
const { verifyJWT } = require('../middleware/auth'); // Import the middleware

router.use(verifyJWT); // Apply the middleware to all route`s in this file

router.post('/creditCard', creditCard.addCreditCard);
router.get('/creditCard', creditCard.getCreditCards);
router.patch('/creditCard', creditCard.updateCreditCard);
router.delete('/creditCard', creditCard.deleteCreditCard);

module.exports = router;