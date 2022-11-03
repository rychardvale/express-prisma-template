import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IJwtPayload } from "../ts/types";
import AppConfig from "../common/app.config";

// Fields required in AuthService config;
type ConfigType = { JWT_SECRET: string; JWT_TTL: string | number };

class AuthService {
    private readonly config: ConfigType;

    constructor(config: ConfigType) {
        this.config = config;
    }

    createJwt(payload: IJwtPayload) {
        return jwt.sign(payload, this.config.JWT_SECRET, {
            expiresIn: this.config.JWT_TTL,
        });
    }

    verifyJwt<T>(token: string) {
        try {
            const payload = jwt.verify(token, this.config.JWT_SECRET) as T;
            return { payload, error: undefined };
        } catch (e) {
            return { payload: undefined, error: e as Error };
        }
    }

    async hashPassword(plainText: string) {
        return bcrypt.hash(plainText, 10);
    }

    async verifyPassword(candidate: string, hashedPassword: string) {
        return bcrypt.compare(candidate, hashedPassword);
    }
}

export default new AuthService(AppConfig);
