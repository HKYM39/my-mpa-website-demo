import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import type { User } from "src/generated/prisma/client";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserDto } from "./dto/update-user.dto";
import type { UserVO } from "./vo/user.vo";

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	create(data: CreateUserDto) {
		return this.prisma.user.create({ data }).then((user) => this.toVO(user));
	}

	findAll() {
		return this.prisma.user
			.findMany({ orderBy: { id: "asc" } })
			.then((list) => list.map((user) => this.toVO(user)));
	}

	async findOne(id: number) {
		const user = await this.prisma.user.findUnique({ where: { id } });
		if (!user) throw new NotFoundException(`User ${id} not found`);
		return this.toVO(user);
	}

	async update(id: number, data: UpdateUserDto) {
		await this.findOne(id);
		return this.prisma.user
			.update({ where: { id }, data })
			.then((user) => this.toVO(user));
	}

	async remove(id: number) {
		await this.findOne(id);
		return this.prisma.user
			.delete({ where: { id } })
			.then((user) => this.toVO(user));
	}

	private toVO(user: User): UserVO {
		return {
			id: user.id,
			email: user.email,
			name: user.name ?? null,
		};
	}
}
