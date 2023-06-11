import cryptoJS from 'crypto-js'
import JWT from 'jsonwebtoken'
import { JwtUserPayload } from '../interfaces/auth';

export const passwordToHash = (password: string) => cryptoJS.HmacSHA512(password, process.env.PASSWORD_KEY as string)
  .toString();

export const generateAccessToken = (user: JwtUserPayload) => (JWT.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY as string, { expiresIn: '1h' }));

export const generateRefreshToken = (user: JwtUserPayload) => JWT.sign(user, process.env.REFRESH_TOKEN_SECRET_KEY as string);