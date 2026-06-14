export type InviteCodeValidation = {
	valid: boolean;
	inviteCodeId?: string;
};

export type CreateInviteCodeInput = {
	code: string;
	expiresAt?: Date | string | null;
};

export type UpdateInviteCodeInput = {
	code: string;
	isActive: boolean;
	expiresAt?: Date | string | null;
};
