import { Injectable } from "@nestjs/common";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma client wrapper to manage lifecycle inside Nest.
@Injectable()
export class PrismaService extends PrismaClient {
	constructor() {
		console.log("[ process.env.DATABASE_URL ] >", process.env.DATABASE_URL);
		const adapter = new PrismaPg({
			connectionString: `${process.env.DATABASE_URL}`,
		});
		super({ adapter });
	}
}
