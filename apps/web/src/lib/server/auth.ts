import { env } from '$env/dynamic/private';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';
import { initDb, db } from '@trak/database';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

initDb(env.DATABASE_URL);

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true },
	user: {
		additionalFields: {
			role: {
				type: 'string',
				required: false,
				defaultValue: 'agent',
				input: false
			},
			isActive: {
				type: 'boolean',
				required: false,
				defaultValue: true,
				input: false
			}
		}
	},
	plugins: [sveltekitCookies(getRequestEvent)]
});
