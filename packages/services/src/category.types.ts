export type CreateCategoryInput = {
	name: string;
	description?: string | null;
};

export type UpdateCategoryInput = {
	name: string;
	description?: string | null;
	isActive: boolean;
};
