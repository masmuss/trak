import { error, type RequestEvent } from '@sveltejs/kit';

export function requireAuth(event: RequestEvent) {
	const user = event.locals.user;
	if (!user) {
		throw error(401, 'Unauthorized');
	}
	return user;
}

export function getFormString(formData: FormData, name: string): string {
	return (formData.get(name) as string) ?? '';
}

export function getFormNullableString(formData: FormData, name: string): string | null {
	const value = formData.get(name) as string | null;
	return value?.trim() || null;
}

export function getFormBool(formData: FormData, name: string): boolean {
	return formData.get(name) === 'true';
}

export function requireExists<T>(entity: T | null | undefined, label: string): asserts entity is T {
	if (!entity) {
		throw error(404, `${label} not found`);
	}
}
