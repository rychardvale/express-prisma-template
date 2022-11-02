import PrismaService from "../common/prisma.service";
import { CreateUserDto } from "./user.schemas";

class UserService {
    private readonly prisma = PrismaService;

    async create(data: CreateUserDto) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                hashedPassword: data.password,
            },
            select: {
                id: true,
            },
        });
    }

    async getByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                email: true,
                sessionVersion: true,
            },
        });
    }

    async getUserWithPassword(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                email: true,
                id: true,
                sessionVersion: true,
                hashedPassword: true,
            },
        });
    }
}

export default new UserService();
