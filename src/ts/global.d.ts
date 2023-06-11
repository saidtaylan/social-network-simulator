import { JwtUserPayload } from "./interfaces/auth";

declare global {
    declare namespace Express {
        interface Request {
            user?: JwtUserPayload
            // Diğer özel özellikler
        }
    }
}