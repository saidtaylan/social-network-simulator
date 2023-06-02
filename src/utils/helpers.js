const cryptoJS = require("crypto-js");

const JWT = require("jsonwebtoken");

const passwordToHash = (password) => {
  return cryptoJS.HmacSHA512(password, process.env.PASSWORD_KEY).toString();
};

const generateAccessToken = (user) => {
  return JWT.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "1W",
  });
};
const generateRefreshToken = (user) => {
  return JWT.sign(user, process.env.REFRESH_TOKEN_SECRET_KEY);
};

module.exports = {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
};
