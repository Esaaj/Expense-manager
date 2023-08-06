require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT

require('./config/db');

const auth = require('./src/routes/user');
const accounts = require('./src/routes/accounts');
const transactions = require('./src/routes/transactions');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', auth);
app.use('/', accounts);
app.use('/', transactions);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

