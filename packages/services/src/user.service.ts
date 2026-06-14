import { eq, and, ne } from 'drizzle-orm';
import { db, user } from '@trak/database';
import type { User } from '@trak/shared';
import type { CreateUserInput, UpdateUserInput } from './user.types';

export async function getUsers(): Promise<User[]> {
	return db.query.user.findMany({
		orderBy: (user, { desc }) => [desc(user.createdAt)]
	});
}

export async function getUserById(id: string): Promise<User | undefined> {
	return db.query.user.findFirst({
		where: eq(user.id, id)
	});
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
	return db.query.user.findFirst({
		where: eq(user.email, email)
	});
}

export async function findUserByEmailExcluding(
	email: string,
	excludeId: string
): Promise<User | undefined> {
	return db.query.user.findFirst({
		where: and(ne(user.id, excludeId), eq(user.email, email))
	});
}

export async function createUser(input: CreateUserInput): Promise<void> {
	await db.insert(user).values({
		id: input.id,
		name: input.name,
		email: input.email,
		emailVerified: true,
		role: input.role,
		isActive: input.isActive
	});
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<void> {
	await db
		.update(user)
		.set({
			name: input.name,
			email: input.email,
			role: input.role,
			isActive: input.isActive
		})
		.where(eq(user.id, id));
}

export async function updateProfile(id: string, name: string): Promise<void> {
	await db.update(user).set({ name: name.trim() }).where(eq(user.id, id));
}

export async function deleteUser(id: string): Promise<void> {
	await db.delete(user).where(eq(user.id, id));
}
