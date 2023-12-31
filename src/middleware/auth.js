const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const verifyJWT = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token.' });
    }

    req.userId = decoded.userId;
    next();
  });
};

module.exports = {
  verifyJWT,
};
