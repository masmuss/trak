import { eq } from 'drizzle-orm';
import { db, account } from '@trak/database';
import type { PasswordAccount, CreateAccountInput } from './account.types';

export async function getPasswordAccount(userId: string): Promise<PasswordAccount | undefined> {
	const result = await db.query.account.findFirst({
		where: eq(account.userId, userId),
		columns: { id: true, password: true }
	});
	return result ?? undefined;
}

export async function updateAccountPassword(userId: string, hashedPassword: string): Promise<void> {
	await db.update(account).set({ password: hashedPassword }).where(eq(account.userId, userId));
}

export async function createAccount(input: CreateAccountInput): Promise<void> {
	await db.insert(account).values({
		id: input.id,
		userId: input.userId,
		accountId: input.accountId,
		providerId: input.providerId,
		password: input.password
	});
}
