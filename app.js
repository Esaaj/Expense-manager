require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
const port = process.env.PORT

require('./config/db');

const auth = require('./src/routes/auth');
const product = require('./src/routes/product');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', auth);
app.use('/bill', bill);

// mongoose.connect('mongodb+srv://Esaaj:dhfWwdfrs4iDaEr@cluster0.gcfaj.mongodb.net/v-fit?retryWrites=true&w=majority');
// //mongoose.connect('mongodb+srv://Esaaj:dhfWwdfrs4iDaEr@cluster0.gcfaj.mongodb.net/v-fit?retryWrites=true&w=majority');

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function () {
//   console.log("Mongo Database Connected Successfully");
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

