import { PrismaClient } from "@prisma/client";

class PrismaService extends PrismaClient {
    constructor() {
        super();
        this.$on("beforeExit", () => {
            console.log("Exiting prisma");
        });
    }
}

export default new PrismaService();
