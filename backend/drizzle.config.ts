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
    ssl: false,
  },
  out: './src/database/migrations',
  verbose: true,
  strict: true,
} satisfies Config;
