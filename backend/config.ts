import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  // keydbPassword: process.env.KEYDB_PASSWORD || '',
  // keydbPort: process.env.KEYDB_PORT || '',
  // keydbHost: process.env.KEYDB_HOST || '',
  dbHost: process.env.DB_HOST || '127.0.0.1',
  dbPort: process.env.DB_PORT || 5431,
  dbName: process.env.DB_NAME || 'postgres',
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || 'example',

  backendUrl: process.env.PUBLIC_API_URL || 'http://localhost:8000',
  frontendUrl: process.env.PUBLIC_FRONT_URL || 'http://localhost:3000',
};

export default config;
