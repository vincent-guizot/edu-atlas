import { Sequelize } from 'sequelize-typescript';
import { dbHost, dbPort, dbUser, dbPassword, targetDbName } from './db-config';
import { Snapshot } from '../models/snapshot.model';
import { Region } from '../models/region.model';
import { School } from '../models/school.model';
import { University } from '../models/university.model';
import { AcademicProgram } from '../models/academic-program.model';
import { EducationIndicator } from '../models/education-indicator.model';
import { AcademicEvent } from '../models/academic-event.model';
import { up, down } from '../migrations/001-domain-schemas';
import { up as addCards, down as removeCards } from '../migrations/002-card-data';
import { CARD_MODELS } from '../models/card-models';
import { QueryTypes } from 'sequelize';

export function getSequelizeInstance(database = targetDbName): Sequelize {
  return new Sequelize({
    dialect: 'postgres',
    host: dbHost,
    port: dbPort,
    username: dbUser,
    password: dbPassword,
    database,
    models: [
      ...CARD_MODELS,
      Snapshot,
      Region,
      School,
      University,
      AcademicProgram,
      EducationIndicator,
      AcademicEvent,
    ],
    logging: (msg) => console.log(`[Sequelize] ${msg}`),
  });
}

export async function applyMigrations(sequelize: Sequelize, undo = false) {
  await sequelize.transaction(async transaction => {
    await sequelize.query('SELECT pg_advisory_xact_lock(20261121, 1)', { transaction });
    await sequelize.query('CREATE SCHEMA IF NOT EXISTS system', { transaction });
    await sequelize.query(`DO $$ BEGIN
      IF to_regclass('public.schema_migrations') IS NOT NULL THEN
        IF to_regclass('system.schema_migrations') IS NOT NULL THEN
          RAISE EXCEPTION 'Both legacy and system migration histories exist';
        END IF;
        ALTER TABLE public.schema_migrations SET SCHEMA system;
      END IF;
    END $$`, { transaction });
    await sequelize.query(`CREATE TABLE IF NOT EXISTS system.schema_migrations (
      name VARCHAR(255) PRIMARY KEY,
      "appliedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`, { transaction });
    await sequelize.query(`CREATE TABLE IF NOT EXISTS system.seed_runs (
      name VARCHAR(255) PRIMARY KEY,
      manifest JSONB NOT NULL,
      "appliedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`, { transaction });
    const applied = await sequelize.query<{ name: string }>(
      'SELECT name FROM system.schema_migrations',
      { type: QueryTypes.SELECT, transaction },
    );
    const migrations = [
      { name: '001-domain-schemas', up, down },
      { name: '002-card-data', up: addCards, down: removeCards },
    ];
    if (undo) {
      const latest = [...migrations].reverse().find(migration => applied.some(row => row.name === migration.name));
      if (!latest) return;
      const seeds = await sequelize.query('SELECT name FROM system.seed_runs', {
        type: QueryTypes.SELECT, transaction,
      });
      if (seeds.length) throw new Error('Run db:seed:undo before db:migrate:undo.');
      await latest.down(sequelize, transaction);
      await sequelize.query('DELETE FROM system.schema_migrations WHERE name = $1', {
        bind: [latest.name], transaction,
      });
    } else {
      for (const migration of migrations) {
        if (applied.some(row => row.name === migration.name)) continue;
        await migration.up(sequelize, transaction);
        await sequelize.query(
          'INSERT INTO system.schema_migrations (name) VALUES ($1)',
          { bind: [migration.name], transaction },
        );
      }
    }
  });
}

export async function migrateDatabase(undo = false) {
  console.log(`[Database Migration] Connecting to "${targetDbName}" on ${dbHost}:${dbPort}...`);
  const sequelize = getSequelizeInstance();

  try {
    await sequelize.authenticate();
    console.log(`[Database Migration] Connected to database successfully.`);

    console.log(`[Database Migration] Applying versioned migrations...`);
    await applyMigrations(sequelize, undo);
    console.log(`[Database Migration] All pending migrations applied successfully!`);
  } catch (error: any) {
    console.error(`[Database Migration] Migration failed: ${error.message}`);
    throw error;
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  migrateDatabase(process.argv.includes('--undo'))
    .then(() => {
      console.log('[Database Migration] Migration completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Database Migration] Migration error:', err.message);
      process.exit(1);
    });
}
