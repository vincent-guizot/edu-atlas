import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Look for .env in apps/backend first, then monorepo root
const backendEnv = path.resolve(__dirname, '../../../.env');
const rootEnv = path.resolve(__dirname, '../../../../.env');
const envPath = fs.existsSync(backendEnv) ? backendEnv : rootEnv;

dotenv.config({ path: envPath });

export const dbHost = process.env.DB_HOST || '127.0.0.1';
export const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
export const dbUser = process.env.DB_USER || 'postgres';
export const dbPassword = process.env.DB_PASS || 'admin';
export const targetDbName = process.env.DB_NAME || 'eduatlas_db';
