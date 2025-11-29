import { query } from '../../backend/src/config/database';
import { logger } from '../../backend/src/utils/logger';
import fs from 'fs';
import path from 'path';

const runMigrations = async (): Promise<void> => {
  try {
    const migrationsDir = __dirname;
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      logger.info(`Running migration: ${file}`);
      
      // Split by semicolon and filter out empty statements
      const statements = sql
        .split(';')
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      for (const statement of statements) {
        await query(statement);
      }

      logger.info(`✓ Migration ${file} completed`);
    }

    logger.info('All migrations completed successfully');
  } catch (error) {
    logger.error('Migration failed', { error: String(error) });
    process.exit(1);
  }
};

export default runMigrations;

// Run if executed directly
if (require.main === module) {
  runMigrations();
}
