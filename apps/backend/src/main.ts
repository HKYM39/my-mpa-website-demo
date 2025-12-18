import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "reflect-metadata";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix("api");
	await app.listen(process.env.PORT ?? 8081);
}
console.log(process.env.DATABASE_URL);
bootstrap();
