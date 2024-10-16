import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

export class MigrationService {
  private conn: Pool;
  constructor() {
    this.conn = new Pool({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
    });
  }

  async runAllMigrations() {
    const migrationsPath = path.join(__dirname, 'sql');
    const files = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith('.sql'));

    for (const file of files) {
      const filePath = path.join(migrationsPath, file);
      const query = fs.readFileSync(filePath, 'utf-8');
      await this.executeMigration(query, file);
    }
  }

  private async executeMigration(query: string, filename: string) {
    try {
      console.log(`Running migration: ${filename}`);
      await this.conn.query(query);
      console.log(`Migration ${filename} executed successfully`);
    } catch (error) {
      console.error(`Error executing migration ${filename}:`, error);
    }
  }
}
