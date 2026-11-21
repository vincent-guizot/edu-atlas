import { getSequelizeInstance } from './migrate';
import { seedAllDemoData } from '../seeders/card-demo';

export async function seedDatabase(undo = false) {
  const sequelize = getSequelizeInstance();
  try {
    await sequelize.authenticate();
    await seedAllDemoData(sequelize, undo);
    console.log(undo ? '[Database Seed] Undo completed.' : '[Database Seed] Demo seed completed; existing records preserved.');
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  seedDatabase(process.argv.includes('--undo')).catch(error => {
    console.error('[Database Seed] Failed:', error.message);
    process.exitCode = 1;
  });
}
