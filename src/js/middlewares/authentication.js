const httpStatus = require('http-status');
const JWT = require('jsonwebtoken');

class Authentication {
  authenticate(req, res, next) {
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) {
      next({ status: httpStatus.UNAUTHORIZED, message: 'token is not valid' });
    }
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (error, user) => {
      if (error) {
        next({ status: httpStatus.FORBIDDEN, message: error.message });
      }
      req.user = user;
      next();
    });
  }
}

module.exports = Authentication;
