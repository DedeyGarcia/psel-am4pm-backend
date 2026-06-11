import { config } from 'dotenv';
import { resolve } from 'node:path';

config({ path: resolve(process.cwd(), '.env.test') });

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL not found, configure the .env.test file before running e2e tests.',
  );
}

process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-test-secret';

export const TEST_DATABASE_URL = process.env.DATABASE_URL;
