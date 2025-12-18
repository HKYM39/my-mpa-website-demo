import type { CreateUserDto } from "./create-user.dto";

// Simple partial type for updates; avoids extra dependencies.
export type UpdateUserDto = Partial<CreateUserDto>;
