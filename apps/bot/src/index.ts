import { db } from '@trak/database';

console.log('Bot starting...');
console.log(`Database URL: ${process.env.DATABASE_URL ? 'configured' : 'missing'}`);
