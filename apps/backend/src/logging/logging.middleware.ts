import { Injectable, Logger, type NestMiddleware } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
	private readonly logger = new Logger("HTTP");

	use(req: Request, res: Response, next: NextFunction) {
		const start = Date.now();

		res.on("finish", () => {
			const duration = Date.now() - start;
			const status = res.statusCode;
			const redirected =
				status >= 300 && status < 400 ? ` -> location: ${res.getHeader("Location") ?? "-"}` : "";

			this.logger.log(
				`${req.method} ${req.originalUrl} ${status} ${duration}ms${redirected}`,
			);
		});

		next();
	}
}
