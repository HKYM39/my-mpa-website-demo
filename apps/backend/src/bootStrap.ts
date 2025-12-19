// src/bootstrap-app.ts
import type { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import express, { type Express } from "express";

// ✅ 明确定义一个可导出的返回类型，避免引用到奇怪的内部类型
export interface NestExpressApp {
	app: INestApplication;
	expressApp: Express;
}

// ✅ 显式标注返回类型：Promise<NestExpressApp>
export async function createNestAppExpress(): Promise<NestExpressApp> {
	const expressApp = express();
	const adapter = new ExpressAdapter(expressApp);

	const app = await NestFactory.create(AppModule, adapter);

	// 这里写你原来 main.ts 里的各种全局配置
	app.setGlobalPrefix("api");
	app.enableCors();
	// app.useGlobalPipes(new ValidationPipe());
	// app.useGlobalFilters(new AllExceptionsFilter());
	// app.useGlobalInterceptors(new LoggingInterceptor());

	// ❗ Lambda 场景只需要 init，不要 listen
	await app.init();

	return { app, expressApp };
}
