import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

type Database = PostgresJsDatabase<typeof schema>;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

let _db: Database | null = null;
let _connectionString: string | undefined;

export function initDb(connectionString: string | undefined) {
	if (!connectionString) throw new Error('DATABASE_URL is not set');
	_connectionString = connectionString;
}

function getClient(): Database {
	if (!_db) {
		const connectionString = _connectionString || process.env.DATABASE_URL;
		if (!connectionString) throw new Error('DATABASE_URL is not set');

		const client = postgres(connectionString);
		_db = drizzle(client, { schema }) as unknown as Database;
	}
	return _db;
}

export function getDb(): Database {
	return getClient();
}

export const db: Database = new Proxy({} as Database, {
	get(_, prop) {
		return getClient()[prop as keyof Database];
	}
});

export { schema };
export * from './schema';
