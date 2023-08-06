const express = require('express');
const router = express.Router();
const transactions = require('../controllers/transactions');
const { verifyJWT } = require('../middleware/auth'); // Import the middleware

router.use(verifyJWT); // Apply the middleware to all routes in this file

router.post('/transactions', (request, response) => {
	transactions.addTransactions(request, function (err, resp) {
		if (err) {
			response.status(500).send(err);
			return;
		}
		response.send(resp);
	})
})

router.get('/transactions', (request, response) => {
	transactions.getTransactions(request, function (err, resp) {
		if (err) {
			response.status(500).send(err);
			return;
		}
		response.send(resp);
	});
});

router.patch('/transactions', (request, response) => {
	transactions.updateTransactions(request, function (err, resp) {
		if (err) {
			response.status(500).send(err);
			return;
		}
		response.send(resp);
	})
})

router.delete('/transactions', (request, response) => {
	transactions.deleteTransactions(request, function (err, resp) {
		if (err) {
			response.status(500).send(err);
			return;
		}
		response.send(resp);
	})
})


module.exports = router;