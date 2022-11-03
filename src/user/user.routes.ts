import express from "express";
import authMiddleware from "../auth/auth.middleware";
import { RouteConfig } from "../common/route.config";
import usersController from "./users.controller";

export class UserRoutes extends RouteConfig {
    constructor(app: express.Application) {
        super(app);
    }

    setupRoutes(): void {
        this.app.route("/users/me").get(
            authMiddleware.extractUserFromJwt,
            usersController.handleGetUser
        )
    }
}
