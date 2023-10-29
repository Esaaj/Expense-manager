const express = require('express');
const router = express.Router();
const accounts = require('../controllers/accounts');
const { verifyJWT } = require('../middleware/auth'); // Import the middleware

router.use(verifyJWT); // Apply the middleware to all route`s in this file

router.post('/accounts', accounts.addAccounts);
router.get('/accounts', accounts.getAccounts);
router.patch('/accounts', accounts.updateAccounts);
router.delete('/accounts', accounts.deleteAccounts);

module.exports = router;