const express = require('express');
const router = express.Router();
const accounts = require('../controllers/accounts');
const { verifyJWT } = require('../middleware/auth'); // Import the middleware

router.use(verifyJWT); // Apply the middleware to all routes in this file

router.post('/accounts', (request, response) => {
	accounts.addAccounts(request, function (err, resp) {
		if (err) {
			response.status(500).send(err);
			return;
		}
		response.send(resp);
	})
})

router.get('/accounts', (request, response) => {
	accounts.getAccounts(request, function (err, resp) {
		if (err) {
			response.status(500).send(err);
			return;
		}
		response.send(resp);
	});
});

router.patch('/accounts', (request, response) => {
	accounts.updateAccounts(request, function (err, resp) {
		if (err) {
			response.status(500).send(err);
			return;
		}
		response.send(resp);
	})
})

router.delete('/accounts', (request, response) => {
	accounts.deleteAccounts(request, function (err, resp) {
		if (err) {
			response.status(500).send(err);
			return;
		}
		response.send(resp);
	})
})


module.exports = router;