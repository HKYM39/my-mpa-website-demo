import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LoggingMiddleware } from "./logging.middleware";

@Module({
	providers: [LoggingMiddleware],
})
export class LoggingModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes("*");
	}
}
