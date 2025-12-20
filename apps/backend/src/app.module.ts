import { Module } from "@nestjs/common";
import { GithubController } from "./github/github.controller";
import { UsersModule } from "./users/users.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "node:path";
import { LoggingModule } from "./logging/logging.module";

const isDev = process.env.NODE_ENV !== "production";

@Module({
	imports: [
		PrismaModule,
		LoggingModule,
		UsersModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [".env"], // 明确指定
		}),
		ServeStaticModule.forRoot({
			rootPath: isDev
				? join(process.cwd(), "src", "views") // 开发环境
				: join(__dirname, "views"), // 编译后生产环境
			exclude: ["/api"],
			serveStaticOptions: {
				index: "index.html",
			},
		}),
	],
	controllers: [GithubController],
})
export class AppModule {}
