const express = require('express');
const router = express.Router();
const budget = require('../controllers/budget');
const { verifyJWT } = require('../middleware/auth'); // Import the middleware

router.use(verifyJWT); // Apply the middleware to all route`s in this file

router.post('/budget', budget.addBudget);
router.get('/budget', budget.getBudgets);
router.patch('/budget', budget.updateBudget);
router.delete('/budget', budget.deleteBudget);
router.get('/budget/summary', budget.getBudgetSummary);

module.exports = router;