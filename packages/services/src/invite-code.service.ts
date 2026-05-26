import { eq, and } from 'drizzle-orm';
import { db, inviteCodes } from '@trak/database';
import type { InviteCode } from '@trak/shared';

export async function getInviteCodes(): Promise<InviteCode[]> {
	return db.query.inviteCodes.findMany({
		orderBy: (inviteCodes, { desc }) => [desc(inviteCodes.createdAt)]
	});
}

export async function getInviteCodeById(id: string): Promise<InviteCode | undefined> {
	return db.query.inviteCodes.findFirst({
		where: eq(inviteCodes.id, id)
	});
}

export async function getInviteCodeByCode(code: string): Promise<InviteCode | undefined> {
	return db.query.inviteCodes.findFirst({
		where: eq(inviteCodes.code, code)
	});
}

export type InviteCodeValidation = {
	valid: boolean;
	inviteCodeId?: string;
};

export async function validateInviteCode(code: string): Promise<InviteCodeValidation> {
	const invite = await db.query.inviteCodes.findFirst({
		where: and(eq(inviteCodes.code, code), eq(inviteCodes.isActive, true))
	});

	if (!invite) return { valid: false };

	if (invite.expiresAt && invite.expiresAt < new Date()) return { valid: false };

	return { valid: true, inviteCodeId: invite.id };
}

export type CreateInviteCodeInput = {
	code: string;
	expiresAt?: Date | string | null;
};

export async function createInviteCode(input: CreateInviteCodeInput): Promise<void> {
	const expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
	await db.insert(inviteCodes).values({
		code: input.code,
		expiresAt
	});
}

export type UpdateInviteCodeInput = {
	code: string;
	isActive: boolean;
	expiresAt?: Date | string | null;
};

export async function updateInviteCode(id: string, input: UpdateInviteCodeInput): Promise<void> {
	const expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
	await db
		.update(inviteCodes)
		.set({
			code: input.code,
			isActive: input.isActive,
			expiresAt
		})
		.where(eq(inviteCodes.id, id));
}

export async function deleteInviteCode(id: string): Promise<void> {
	await db.delete(inviteCodes).where(eq(inviteCodes.id, id));
}
