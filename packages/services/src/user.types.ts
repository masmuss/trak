export type CreateUserInput = {
	id: string;
	name: string;
	email: string;
	role: string;
	isActive: boolean;
};

export type UpdateUserInput = {
	name: string;
	email: string;
	role: string;
	isActive: boolean;
};
