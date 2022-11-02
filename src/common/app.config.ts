import { z } from "zod";
import dotenv from "dotenv";

// Loads .env files
dotenv.config();

// Default config schema to be used in the whole app.
// Add aditional fields here with zod validations
// All fields are fully typed thanks to zod.
const configSchema = z.object({
    APP_PORT: z
        .number()
        .int("Must be int")
        .min(0, "Must be greater than 0")
        .default(3000),
    JWT_SECRET: z.string().min(5),
    JWT_TTL: z.string().default("7d")
});

// You can safeParse if you prefer do the error handling yourself
const AppConfig = configSchema.parse(process.env);

export type ConfigType = typeof AppConfig;
export default AppConfig;
