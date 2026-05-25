import { eq } from 'drizzle-orm';
import { db, categories } from '@trak/database';
import type { Category } from '@trak/shared';

export async function getCategories(): Promise<Category[]> {
	return db.query.categories.findMany({
		orderBy: (categories, { desc }) => [desc(categories.createdAt)]
	});
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
	return db.query.categories.findFirst({
		where: eq(categories.id, id)
	});
}

export type CreateCategoryInput = {
	name: string;
	description?: string | null;
};

export async function createCategory(input: CreateCategoryInput): Promise<void> {
	await db.insert(categories).values({
		name: input.name.trim(),
		description: input.description?.trim() || null
	});
}

export type UpdateCategoryInput = {
	name: string;
	description?: string | null;
	isActive: boolean;
};

export async function updateCategory(id: string, input: UpdateCategoryInput): Promise<void> {
	await db
		.update(categories)
		.set({
			name: input.name.trim(),
			description: input.description?.trim() || null,
			isActive: input.isActive
		})
		.where(eq(categories.id, id));
}

export async function deleteCategory(id: string): Promise<void> {
	await db.delete(categories).where(eq(categories.id, id));
}
