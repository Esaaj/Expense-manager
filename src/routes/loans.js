const express = require('express');
const router = express.Router();
const loans = require('../controllers/loans');
const { verifyJWT } = require('../middleware/auth'); // Import the middleware

router.use(verifyJWT); // Apply the middleware to all route`s in this file

router.post('/loans', loans.addLoan);
router.get('/loans', loans.getLoans);
router.patch('/loans', loans.updateLoan);
router.delete('/loans', loans.deleteLoan);

module.exports = router;