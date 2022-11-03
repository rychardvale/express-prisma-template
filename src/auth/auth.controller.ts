import e from "express";
import { HttpStatus, ResponseWithUser } from "../ts/types";
import { createUserDto } from "../users/users.schemas";
import UserService from "../users/users.service";
import { AuthConstants } from "./auth.constants";
import AuthService from "./auth.service";

class AuthController {

    async handleSignOut(_: e.Request, res: ResponseWithUser) {
        res.clearCookie(AuthConstants.JWT_COOKIE_KEY);
        await UserService.incrementUserSessionVersion(res.locals.user.id);
        return res.status(HttpStatus.OK).send();
    }

    async handleRegister(req: e.Request, res: e.Response) {
        const result = createUserDto.parse(req.body);
        const hashedPassword = await AuthService.hashPassword(
            req.body.password
        );
        result.password = hashedPassword;

        await UserService.create(result);
        return res.status(HttpStatus.CREATED).send();
    }

    /**
     * Creates JWT with user data and assigns to httponly cookie
     * User must be present at Express.Response.locals.user
     * @see {@link AuthMiddleware.getUserFromCredentials}
     */
    handleLogin(_: e.Request, res: ResponseWithUser) {
        const jwt = AuthService.createJwt({
            sessionVersion: res.locals.user.sessionVersion,
            sub: res.locals.user.id,
        });
        const sevenDaysInMs = 1000 * 60 * 60 * 24 * 7;
        res.cookie(AuthConstants.JWT_COOKIE_KEY, jwt, {
            httpOnly: true,
            maxAge: sevenDaysInMs,
        });

        return res.status(HttpStatus.CREATED).send();
    }
}

export default new AuthController();
