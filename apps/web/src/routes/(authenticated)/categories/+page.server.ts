import type { PageServerLoad, Actions } from './$types';
import { getCategories } from '@trak/services';
import {
	createCategoryAction,
	updateCategoryAction,
	deleteCategoryAction
} from '$lib/features/category/category.actions.server';

export const load: PageServerLoad = async () => {
	const allCategories = await getCategories();
	return { categories: allCategories };
};

export const actions: Actions = {
	create: createCategoryAction,
	update: updateCategoryAction,
	delete: deleteCategoryAction
};
