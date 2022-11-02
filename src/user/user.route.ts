import express from "express";
import { RouteConfig } from "../common/route.config";

export class UserRoutes extends RouteConfig {
    constructor(app: express.Application) {
        super(app);
    }

    setupRoutes(): void {}
}
