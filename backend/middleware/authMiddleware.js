const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  console.log('Token received:', token);

  try {
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.user = decoded.user;


    if (!req.user) {
      console.error('Decoded token does not contain user information');
      return res.status(401).json({ msg: 'Token is valid but user information is missing' });
    }

    next();
  } catch (err) {

    if (err.name === 'TokenExpiredError') {
      console.error('Token expired:', err.message);
      return res.status(401).json({ msg: 'Token has expired' });
    } else if (err.name === 'JsonWebTokenError') {
      console.error('JWT Error:', err.message);
      return res.status(401).json({ msg: 'Token is not valid' });
    } else {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ msg: 'Token verification failed' });
    }
  }
};

module.exports = authMiddleware;
