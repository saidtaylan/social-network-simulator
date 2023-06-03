const httpStatus = require('http-status');
const JWT = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // ilk eleman 'Bearer' yazısı olduğu için ikinci eleman tokendir
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
};

module.exports = authenticate;
