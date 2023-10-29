const mongoose = require('mongoose');
const logger = require('./console');
const { DATABASE, MONGODB_URI } = process.env;

mongoose.Promise = global.Promise;

// Mongoose connection
mongoose.connect(MONGODB_URI, {
  dbName: DATABASE,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', (err) => {
  logger.error(err);
  logger.info(
    '%s MongoDB connection error. Please make sure MongoDB is running.',
  );
  process.exit();
});

mongoose.connection.on('open', () => {
  logger.info(`Connected to Database`);
});