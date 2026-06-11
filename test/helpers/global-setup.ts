import { execSync } from 'node:child_process';
import './test-env';

export default function globalSetup(): void {
  execSync('npx prisma db push --accept-data-loss', {
    stdio: 'inherit',
    env: process.env,
  });
}
