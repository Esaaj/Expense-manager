const express = require('express');
const router = express.Router();
const fd = require('../controllers/fd');
const { verifyJWT } = require('../middleware/auth'); // Import the middleware

router.use(verifyJWT); // Apply the middleware to all route`s in this file

router.post('/fd', fd.addFD);
router.get('/fd', fd.getFDs);
router.patch('/fd', fd.updateFD);
router.delete('/fd', fd.deleteFD);

module.exports = router;