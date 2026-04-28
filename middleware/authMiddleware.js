const jwt = require('jsonwebtoken');

const SECRET = 'mysecretkey';

function auth(req, res, next) {
  const header = req.headers['authorization'];

  if (!header) {
    return res.status(401).json({ message: '❌ No token' });
  }

  const token = header.split(' ')[1];

  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: '❌ Invalid token' });
  }
}

module.exports = auth;