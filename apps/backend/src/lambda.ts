// src/lambda.ts
import type {
	APIGatewayProxyEventV2,
	Context,
	Handler as LambdaHandler,
} from "aws-lambda";
import serverlessExpress from "@vendia/serverless-express";
import { createNestAppExpress } from "./bootStrap";

let server: LambdaHandler | undefined;

async function setupServer(): Promise<LambdaHandler> {
	if (!server) {
		console.log("[Lambda] Initializing Nest + Express");
		const { expressApp } = await createNestAppExpress();
		server = serverlessExpress({ app: expressApp });
		console.log("[Lambda] Nest + Express initialized");
	}
	return server;
}

export const handler: LambdaHandler = async (
	event: APIGatewayProxyEventV2,
	context: Context,
	callBack,
) => {
	const method = event.requestContext?.http?.method;
	const path = event.requestContext?.http?.path ?? event.rawPath;

	console.log(
		`[Lambda] Incoming event ${method} ${path} - requestId=${event.requestContext?.requestId}`,
	);

	try {
		const srv = await setupServer();
		const result: any = await srv(event as any, context, callBack);

		console.log(
			`[Lambda] Handler result ${method} ${path} -> ${result?.statusCode}`,
		);

		return result;
	} catch (err: any) {
		console.error(
			`[Lambda] Top-level error ${method} ${path}:`,
			err?.message,
			err?.stack,
		);
		throw err;
	}
};
