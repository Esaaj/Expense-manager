const express = require('express');
const router = express.Router();
const rd = require('../controllers/rd');
const { verifyJWT } = require('../middleware/auth'); // Import the middleware

router.use(verifyJWT); // Apply the middleware to all route`s in this file

router.post('/rd', rd.addRD);
router.get('/rd', rd.getRDs);
router.patch('/rd', rd.updateRD);
router.delete('/rd', rd.deleteRD);

module.exports = router;