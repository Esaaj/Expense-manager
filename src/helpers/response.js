/* eslint-disable object-shorthand */
const statusCode = require('./constant');

const response = {
  statusCode: statusCode.STATUS_CODE.OK,
  message: 'Request Success',
  errorMessage: 'Something went wrong, Kindly try again',
  success: function ({ res, headers, status, msg, data }) {
    if (headers) {
      res.set(headers);
    }
    if (!data) {
      this.statusCode = statusCode.STATUS_CODE.NO_CONTENT;
    }
    return res.status(status || this.statusCode).json({
      msg: msg || this.message,
      data: data,
    });
  },
  error: function ({ res, headers, status, error, data }) {
    if (headers) {
      res.set(headers);
    }
    return res.status(status || 400).json({
      msg: error || this.errorMessage,
      data: data,
    });
  },
};

module.exports = response;
