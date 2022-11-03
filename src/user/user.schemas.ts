import { z } from "zod";
const zString = z
    .string({ required_error: "Invalid value" })

export const createUserDto = z.object({
    email: zString.email("Needs to be a valid email"),
    password: zString.min(6, "Needs to be at least 6 char long")
}).brand<"CreateUser">();
export type CreateUserDto = z.infer<typeof createUserDto>;


