import type { UserRole } from '@trak/shared';

export type CreateUserInput = {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	isActive: boolean;
};

export type UpdateUserInput = {
	name: string;
	email: string;
	role: UserRole;
	isActive: boolean;
};
