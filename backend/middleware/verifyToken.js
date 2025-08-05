// middleware/verifyToken.js
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(errorHandler(401, "unauthurized"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export default verifyToken;