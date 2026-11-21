import { createDatabase } from './create-database';
import { migrateDatabase } from './migrate';
import { seedDatabase } from './seed';

export async function setupDatabase() {
  console.log('========================================================');
  console.log('  EduAtlas Database Setup & Migration Runner           ');
  console.log('========================================================\n');

  try {
    console.log('[Step 1/3] Creating database if not exists...');
    await createDatabase();
    console.log('[Step 1/3] Database check/creation complete.\n');

    console.log('[Step 2/3] Migrating database schema...');
    await migrateDatabase();
    console.log('[Step 2/3] Migration complete.\n');

    console.log('[Step 3/3] Seeding initial snapshots data...');
    await seedDatabase();
    console.log('[Step 3/3] Data seeding complete.\n');

    console.log('========================================================');
    console.log('  EduAtlas Database Setup Completed Successfully!       ');
    console.log('========================================================');
  } catch (error: any) {
    console.error('\n[Database Setup] Failed during database setup:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  setupDatabase();
}
