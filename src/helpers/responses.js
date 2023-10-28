function sendResponse(res, status, message, data) {
    return res.status(status).json({
        status: status,
        msg: message,
        data: data,
    });
}

module.exports = { sendResponse };