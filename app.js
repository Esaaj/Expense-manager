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
const budgets = require('./src/routes/budgets');
const creditCard = require('./src/routes/creditCard');
const fd = require('./src/routes/fd');
const rd = require('./src/routes/rd');
const mutualFunds = require('./src/routes/mutualFunds');
const loans = require('./src/routes/loans');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', auth);
app.use('/', accounts);
app.use('/', transactions);
app.use('/', budgets);
app.use('/', creditCard);
app.use('/', fd);
app.use('/', rd);
app.use('/', mutualFunds);
app.use('/', loans);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

