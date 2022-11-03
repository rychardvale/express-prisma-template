import e from "express";
import { RouteConfig } from "../common/route.config";
import AuthController from "./auth.controller";
import AuthMiddleware from "./auth.middleware";

export class AuthRoutes extends RouteConfig {
    constructor(app: e.Application) {
        super(app);
    }

    setupRoutes(): void {
        this.app
            .route("/auth/session")
            .post(
                AuthMiddleware.validateSignInBody,
                AuthMiddleware.getUserFromCredentials,
                AuthController.handleLogin
            ).delete(
                AuthMiddleware.extractJwtPayloadFromCookie,
                AuthController.handleSignOut

            );
        this.app
            .route("/auth/register")
            .post(
                AuthMiddleware.validateRegistrationBody,
                AuthMiddleware.uniqueEmailRequired,
                AuthController.handleRegister
            );
    }
}
