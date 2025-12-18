import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GithubController } from "./github/github.controller";
import { UsersModule } from "./users/users.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		PrismaModule,
		UsersModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [".env"], // 明确指定
		}),
	],
	controllers: [AppController, GithubController],
	providers: [AppService],
})
export class AppModule {}
