import { eq } from 'drizzle-orm';
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
