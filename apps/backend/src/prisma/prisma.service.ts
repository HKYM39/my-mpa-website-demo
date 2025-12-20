import {
	Injectable,
	Logger,
	type OnModuleDestroy,
	type OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "node:fs";
import path from "node:path";

// Prisma client wrapper to manage lifecycle inside Nest.
@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger("Prisma");

	constructor() {
		const adapter = new PrismaPg({
			connectionString: `${process.env.DATABASE_URL}`,
			ssl: {
				rejectUnauthorized: true,
				ca: readFileSync(path.join(__dirname, "../certs/db-ca.pem")).toString(),
			},
		});
		super({ adapter });
	}

	async onModuleInit() {
		// this.logger.log(`Database connect to ${process.env.DATABASE_URL}`);
		await this.$connect();
		this.logger.log("Database connected");
	}

	async onModuleDestroy() {
		await this.$disconnect();
		this.logger.log("Database connection closed");
	}
}
