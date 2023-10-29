const express = require('express');
const router = express.Router();
const mutualFunds = require('../controllers/mutualFunds');
const { verifyJWT } = require('../middleware/auth'); // Import the middleware

router.use(verifyJWT); // Apply the middleware to all route`s in this file

router.post('/mutualFunds', mutualFunds.createMutualFund);
router.get('/mutualFunds', mutualFunds.getAllMutualFunds);
router.patch('/mutualFunds', mutualFunds.updateMutualFundById);
router.delete('/mutualFunds', mutualFunds.deleteMutualFundById);

module.exports = router;