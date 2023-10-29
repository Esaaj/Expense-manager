const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const { verifyJWT } = require('../middleware/auth'); // Import the middleware

router.use(verifyJWT); // Apply the middleware to all routes in this file
router.get('/user', user.getUser);
router.post('/user', user.addUser);
router.patch('/user', user.updateUser);

module.exports = router;