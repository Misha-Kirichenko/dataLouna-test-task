import { SeederService } from '../seeders/seederService';

async function runSeeders() {
  const seederService = new SeederService();
  await seederService.runAllSeeders();
  console.log('All seeders executed successfully');
  process.exit(0);
}

runSeeders().catch((error) => {
  console.error('Error running seeders:', error);
  process.exit(1);
});
