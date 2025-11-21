// import 'dotenv/config';
// import { defineConfig } from 'drizzle-kit';

// export default defineConfig({
//   out: './drizzle',
//   schema: './src/database/schema.ts',
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: process.env.DB_HOST!,
//   },
// });

import { Config } from 'drizzle-kit';
import config from './config';

export default {
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  dbCredentials: {
    host: config.dbHost,
    port: +config.dbPort,
    database: config.dbName,
    user: config.dbUser,
    password: config.dbPassword,
  },
  out: './src/database/migrations',
  verbose: true,
  strict: true,
} satisfies Config;
