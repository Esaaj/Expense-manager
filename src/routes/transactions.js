const express = require('express');
const router = express.Router();
const transactions = require('../controllers/transactions');
const { verifyJWT } = require('../middleware/auth'); // Import the middleware

router.use(verifyJWT); // Apply the middleware to all routes in this file

router.post('/transactions', transactions.addTransactions);
router.get('/transactions', transactions.getTransactions);
router.patch('/transactions', transactions.updateTransactions);
router.delete('/transactions', transactions.deleteTransactions);

module.exports = router;