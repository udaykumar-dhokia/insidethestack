import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../shared/prisma.service";
import { AuthService } from "./auth.service";
import { RmqModule } from "@app/shared";

@Module({
    imports: [RmqModule.register({ name: 'EMAIL_SERVICE', queue: 'email_queue' })],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}