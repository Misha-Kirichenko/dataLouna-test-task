import { MigrationService } from '../migrations/migration.service';

async function runMigrations() {
  const migrationService = new MigrationService();
  await migrationService.runMigrations();
  console.log('All migrations executed successfully');
  process.exit(0);
}

runMigrations().catch((error) => {
  console.error('Error running migrations:', error);
  process.exit(1);
});
