import e from "express";
import { z } from "zod";
import { HttpStatus, IJwtPayload, ResponseWithCredentials } from "../ts/types";
import { createUserDto } from "../users/users.schemas";
import userService from "../users/users.service";
import { AuthConstants } from "./auth.constants";
import authService from "./auth.service";

/**
 * AuthMiddleware namespace. Created for organization and pattern purposes.
 */
class AuthMiddleware {

    /**
     * Checks if JWT is in cookies. Parse it and fetches the user.
     * Appends the user data to Express.Response.locals.user
     */
    async extractUserFromJwt(
        req: e.Request,
        res: e.Response,
        next: e.NextFunction
    ) {
        const token = req.cookies[AuthConstants.JWT_COOKIE_KEY];
        if (!token) {
            return res.status(HttpStatus.FORBIDDEN).send();
        }

        const { payload, error } = authService.verifyJwt<IJwtPayload>(token);
        if (error) {
            return res.status(HttpStatus.FORBIDDEN).send();
        }

        const user = await userService.getById(payload.sub);
        if (user === null) {
            return res.status(HttpStatus.FORBIDDEN).send();
        }

        res.locals.user = user;
        return next();
    }

    /**
     * Extracts the credentials from body using zod.
     * The request body needs to be in {email, password} format.
     * If the body is invalid, returns Bad Request response.
     * If valid, appends the result to Express.Response.locals.credentials
     * @returns NextFunction
     */
    validateSignInBody(req: e.Request, res: e.Response, next: e.NextFunction) {
        const loginSchema = z.object({
            email: z.string().email("Needs to be a valid email"),
            password: z
                .string()
                .min(6, "Needs to be atleast 6 characters long"),
        });

        const result = loginSchema.safeParse(req.body);
        if (result.success === false) {
            return res.status(HttpStatus.BAD_REQUEST).send();
        }

        // used later on controllers
        res.locals.credentials = {
            email: result.data.email,
            password: result.data.password,
        };

        return next();
    }

    /**
     * Fetches user from credentials body
     * Appends the user in res.locals.user
     * @see {@link validateSignInBody}
     */
    async getUserFromCredentials(
        _: e.Request,
        res: ResponseWithCredentials,
        next: e.NextFunction
    ) {
        const user = await userService.getUserWithPassword(
            res.locals.credentials.email
        );
        if (user === null) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .send({ error: "Invalid credentials" });
        }

        const result = await authService.verifyPassword(
            res.locals.credentials.password,
            user.hashedPassword
        );
        if (result === false) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .send({ error: "Invalid credentials" });
        }

        res.locals.user = {
            ...user,
            hashedPassword: undefined,
        };

        return next();
    }

    /**
     * Validates request body with createUserDto schema.
     * Appends the result to request.body.
     */
    validateRegistrationBody(
        req: e.Request,
        res: e.Response,
        next: e.NextFunction
    ) {
        const result = createUserDto.safeParse(req.body);
        if (result.success === false) {
            return res.status(HttpStatus.BAD_REQUEST).send();
        }

        req.body = result.data;
        return next();
    }

    /**
     * Verifies if email in registration is unique
     * Assumes the body is already validated
     * @see validateRegistrationBody
     */
    async uniqueEmailRequired(
        req: e.Request,
        res: e.Response,
        next: e.NextFunction
    ) {
        const existingUser = await userService.getByEmail(req.body.email);
        if (existingUser !== null) {
            return res
                .status(HttpStatus.CONFLICT)
                .send({ error: "Email in use" });
        }

        return next();
    }
}

export default new AuthMiddleware();
