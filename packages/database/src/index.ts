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
let _sql: postgres.Sql | null = null;
let _connectionString: string | undefined;

export function initDb(connectionString: string | undefined) {
	if (!connectionString) throw new Error('DATABASE_URL is not set');
	_connectionString = connectionString;
}

function getSql(): postgres.Sql {
	if (!_sql) {
		const connectionString = _connectionString || process.env.DATABASE_URL;
		if (!connectionString) throw new Error('DATABASE_URL is not set');

		_sql = postgres(connectionString);
		_db = drizzle(_sql, { schema }) as unknown as Database;
	}
	return _sql;
}

function getClient(): Database {
	getSql();
	return _db!;
}

export function listen(channel: string, callback: (payload: string) => void) {
	return getSql().listen(channel, callback);
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
export { createPgSessionAdapter } from './session-adapter';
