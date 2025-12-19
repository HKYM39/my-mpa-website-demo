// src/lambda.ts
import type { Handler } from "aws-lambda";
import serverlessExpress from "@vendia/serverless-express";
import { createNestAppExpress } from "./bootStrap";

let server: ReturnType<typeof serverlessExpress>;

async function setupServer() {
	if (!server) {
		const { expressApp } = await createNestAppExpress();
		// 这里用 vendia 的 serverless-express
		server = serverlessExpress({ app: expressApp });
	}
	return server;
}

export const handler: Handler = async (event, context, callBack) => {
	const server = await setupServer();
	return server(event, context, callBack);
};
