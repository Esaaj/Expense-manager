const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const auth = require('../controllers/auth');

router.post('/login', (request, response) => {
	auth.login(request.body, function (err, resp) {
		if (err) {
			response.status(500).send(err);
			return;
		}
		response.send(resp);
	})
})

router.get('/', (request, response) => {
	user.getUsers(request.query, function (err, resp) {
		if (err) {
			response.status(500).send(err);
			return;
		}
		response.send(resp);
	});
});

router.post("/addUser", (request, response) => {
	user.addUser(request.body, function (err, resp) {
		if (err) {
			response.status(500).send(err);
			return;
		}
		response.send(resp);
	});
});

module.exports = router;