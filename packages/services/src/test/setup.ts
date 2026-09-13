import { initDb } from '@trak/database';

// @trak/database loads the root .env on import, so DATABASE_URL is available here.
const baseUrl = process.env.DATABASE_URL;
if (!baseUrl) throw new Error('DATABASE_URL is not set (root .env)');

const testUrl = process.env.DATABASE_URL_TEST ?? baseUrl.replace(/\/local(?=[/?]|$)/, '/trak_test');

initDb(testUrl);
