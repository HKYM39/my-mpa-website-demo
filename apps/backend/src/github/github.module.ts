import { GithubController } from "./github.controller";
import { Module } from "@nestjs/common";

@Module({
	controllers: [GithubController],
})
export class UsersModule {}
