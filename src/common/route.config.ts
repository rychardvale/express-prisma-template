import express from "express";

/**
 * Default route config to be used throughout the app routes
 * All routes should extend this class.
 * @param app - Express application
 */
export abstract class RouteConfig {
    app: express.Application;

    constructor(app: express.Application) {
        this.app = app;
        this.setupRoutes();
    }

    /**
     * Appends the class routes to the app
     */
    abstract setupRoutes(): void;
}
