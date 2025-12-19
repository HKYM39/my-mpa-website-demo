// src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();
	// 同样的全局配置也可以放这里，
	// 或者直接复用 bootstrap-app.ts 里抽象出来的逻辑

	const port = process.env.PORT || 3000;
	await app.listen(port);
	console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
