// src/main.ts
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./logging/global-exception.filter";

async function bootstrap() {
	const logger = new Logger("Bootstrap");
	logger.log("Starting application...");

	const app = await NestFactory.create(AppModule);

	app.enableCors();
	// 同样的全局配置也可以放这里，
	// 或者直接复用 bootstrap-app.ts 里抽象出来的逻辑
	app.setGlobalPrefix("api");
	app.useGlobalFilters(new GlobalExceptionFilter());

	const port = process.env.PORT || 3000;
	await app.listen(port);
	logger.log(`Server running on http://localhost:${port}`);
}
bootstrap();
