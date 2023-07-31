const _ = require('underscore');
const fs = require('fs');
const moment = require('moment');
const Jimp = require('jimp');
const is = require('validator.js').Assert;
const validator = require('validator.js').validator();
const uuid = require('uuid');
const { findSuburb } = require('../controllers/postcode/postcode');
const path = require('path');
const { spawn } = require('child_process');
const tokenRandomString = require('crypto-random-string');

/**
 * Generates a uniqueId
 */
const randomString = () => {
  return uuid.v4();
};

const matchStr = (str, sub) => {
  sub = sub.toLowerCase();
  return str
    .toLowerCase()
    .startsWith(sub.slice(0, Math.max(str.length - 1, 1)));
};

/**
 * Removes the file, if it exists
 * @param {string} fileLocation
 */
const removeFile = (fileLocation) => {
  return fs.existsSync(fileLocation)
    ? fs.unlinkSync(fileLocation)
    : 'File not found';
};

/**
 * Returns Width and height of an image
 * @param {string} fileLocation
 */
const sizeOf = async (fileLocation) => {
  try {
    const size = await Jimp.read(fileLocation);
    delete size.bitmap.data;
    return size.bitmap;
  } catch (error) {
    return error;
  }
};
/**
 * Checks whether the given string exists or not
 * @param {String} actualValue
 * @param {String} searchValue
 */

const stringExists = (actualValue, searchValue) => {
  return searchValue.length === 1
    ? actualValue.split(' ').includes(searchValue)
    : actualValue.includes(searchValue);
};

/**
 * Find And Replace the given String
 * @param {String} actualValue
 * @param {String} value
 * @param {String} replaceValue
 */
const findAndReplaceString = (actualValue, value, replaceValue) => {
  return actualValue.replace(value, replaceValue);
};

//data.name.toLowerCase() should be replaced by data.suburb.toLowerCase()
const addressvalidator = (address, addressvalidation) => {
  let result = addressvalidation;
  let addrs = address.toLowerCase();

  //If no data found from validation url response
  if (result.length == 0) {
    return false;
  }

  let Filterresult = result.filter((data) => {
    let addr = data.suburb.toLowerCase();
    addr = addr.replace(/-/g, ' ');
    if (addrs.includes(addr)) {
      return true;
    }
  });

  //If name found from validation url response
  if (Filterresult.length > 0) {
    return true;
  }

  return false;
};

const validate = async (data) => {
  let { stateIssue, address, licenseNumber } = data;
  let postcode = address.substr(address.length - 4);
  let addressvalidation = await findSuburb(postcode);

  if (addressvalidation) {
    switch (stateIssue) {
      case 'NSW':
        constraint = {
          licenseNumber: [is.ofLength({ min: 6, max: 8 })],
          address: [is.callback(addressvalidator, addressvalidation)],
        };
        break;
      case 'VIC':
        constraint = {
          licenseNumber: [is.ofLength({ min: 1, max: 10 })],
          address: [is.callback(addressvalidator, addressvalidation)],
        };
        break;
      case 'ACT':
        constraint = {
          licenseNumber: [is.ofLength({ min: 1, max: 10 })],
          address: [is.callback(addressvalidator, addressvalidation)],
        };
        break;
      case 'TAS':
        constraint = {
          licenseNumber: [is.ofLength({ min: 6, max: 8 })],
          address: [is.callback(addressvalidator, addressvalidation)],
        };
        break;
      case 'QLD':
        constraint = {
          licenseNumber: [is.ofLength({ min: 8, max: 9 })],
          address: [is.callback(addressvalidator, addressvalidation)],
        };
        break;
      case 'WA':
        constraint = {
          licenseNumber: [is.ofLength({ min: 1, max: 7 })],
          address: [is.callback(addressvalidator, addressvalidation)],
        };
        break;
      case 'SA':
        constraint = {
          licenseNumber: [is.ofLength({ min: 1, max: 6 })],
          address: [is.callback(addressvalidator, addressvalidation)],
        };
        break;
      default:
        constraint = {
          licenseNumber: [is.ofLength({ min: 1, max: 5 })],
          address: [is.callback(addressvalidator, addressvalidation)],
        };
        break;
    }

    let validationResponse = validator.validate(data, constraint);
    if (validationResponse == true) {
      return true;
    } else {
      return false;
    }
  }
};

const handlePromise = (promise) => {
  return promise
    .then((data) => [undefined, data])
    .catch((error) => Promise.resolve([error, undefined]));
};

/**
 * Format Date
 * @param {String} date
 */
const dateFormatter = (date) => {
  let formattedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
  if (formattedDate === 'Invalid date')
    formattedDate = moment(date, 'Do MMMM YYYY').format('YYYY-MM-DD');
  if (formattedDate === 'Invalid date')
    formattedDate = moment(date, 'YYMMDD').format('MM/DD/YYYY');
  if (formattedDate === 'Invalid date') formattedDate = '';

  return formattedDate.trim();
};

const passportDateFormatter = (date) => {
  let formattedDate = moment(date, 'YYMMDD').format('MM/DD/YYYY');

  if (formattedDate === 'Invalid date') formattedDate = '';

  return formattedDate.trim();
};

const findDays = (date1, date2) => {
  return Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
};

const capitalize = (input) => {
  return input
    .toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
};

const nameFormatter = async (name, state) => {
  return new Promise(async (resolve, reject) => {
    try {
      const nameParserScriptPath = path.join(
        __dirname,
        '../../fullNameParser.py',
      );
      const python = spawn('python3', [nameParserScriptPath, name, state]);

      python.stdout.on('data', async (data) => {
        let names = JSON.parse(data);
        return resolve(names);
      });

      python.stderr.on('data', (data) => {
        console.log(`Parsing stderr${data}`);
        return reject(data);
      });

      python.on('error', (err) => {
        console.log(`name parser error${err.message}`);
        return reject(err);
      });

      python.on('exit', async (code, signal) => {
        if (code) {
          console.log(
            `Error in python name parser exit function code: ${code} signal:${signal}`,
          );
          return reject(code);
        } else if (signal) {
          console.log(
            `Error in python name parser exit function code: ${code} signal:${signal}`,
          );
          return reject(signal);
        }
      });
    } catch (error) {
      return reject(error);
    }
  });
};

/**
 * Generate validation token with randomString
 */
const createToken = (logger, length, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = tokenRandomString({
        length,
        type,
      });
      return resolve(token);
    } catch (error) {
      logger.error(error);
      return reject(error.message);
    }
  });
};

module.exports = {
  nameFormatter,
  randomString,
  removeFile,
  dateFormatter,
  validate,
  findAndReplaceString,
  stringExists,
  findDays,
  sizeOf,
  handlePromise,
  capitalize,
  matchStr,
  passportDateFormatter,
  createToken,
};
