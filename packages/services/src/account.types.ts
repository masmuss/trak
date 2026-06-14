export type PasswordAccount = {
	id: string;
	password: string | null;
};

export type CreateAccountInput = {
	id: string;
	userId: string;
	accountId: string;
	providerId: string;
	password: string;
};
