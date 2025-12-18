// Synced with backend VO at apps/backend/src/users/vo/user.vo.ts
export type UserVO = {
	id: number;
	email: string;
	name: string | null;
};
