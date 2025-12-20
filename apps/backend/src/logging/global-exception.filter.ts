import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from "@nestjs/common";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger("Exception");

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest<Request>();

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;
		const payload =
			exception instanceof HttpException
				? exception.getResponse()
				: "Internal server error";

		this.logger.error(
			`[${request.method}] ${request.url} -> ${status}`,
			exception instanceof Error ? exception.stack : String(exception),
		);

		// 写回统一结构，避免异常未响应导致挂起
		response.status(status).json({
			statusCode: status,
			path: request.url,
			timestamp: new Date().toISOString(),
			error: payload,
		});
	}
}
