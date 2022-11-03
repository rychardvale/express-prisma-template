import express from "express"
import * as http from "http"
import cors from "cors"
import helmet from "helmet"

import { AuthRoutes } from "./auth/auth.routes"
import AppConfig from "./common/app.config"
import { UserRoutes } from "./users/users.routes"

const app = express();
const httpServer = http.createServer(app);

app.use(express.json())
app.use(cors());
app.use(helmet());

new AuthRoutes(app);
new UserRoutes(app);

httpServer.listen(AppConfig.APP_PORT, () => {
    console.log(`Listenning on port ${AppConfig.APP_PORT}`);
})
