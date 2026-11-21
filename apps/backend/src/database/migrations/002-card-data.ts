import { Sequelize } from 'sequelize-typescript';
import { QueryTypes, Transaction } from 'sequelize';

export const cardTables = [
  ['system', 'data_sources'], ['system', 'data_imports'],
  ['academic', 'timeline_programs'], ['directory', 'institution_links'],
  ['analytics', 'report_definitions'],
] as const;

export async function up(sequelize: Sequelize, transaction: Transaction) {
  await sequelize.query(`
    CREATE TABLE system.data_sources (
      id VARCHAR(255) PRIMARY KEY, name VARCHAR(255) NOT NULL UNIQUE,
      provider VARCHAR(255) NOT NULL,
      "sourceType" VARCHAR(20) NOT NULL CHECK ("sourceType" IN ('snapshot','file','api')),
      url TEXT, "isEnabled" BOOLEAN NOT NULL DEFAULT TRUE,
      "isDemoData" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMPTZ NOT NULL, "updatedAt" TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE system.data_imports (
      id VARCHAR(255) PRIMARY KEY,
      "sourceId" VARCHAR(255) NOT NULL REFERENCES system.data_sources(id) ON DELETE RESTRICT,
      status VARCHAR(20) NOT NULL CHECK (status IN ('queued','running','completed','failed')),
      "startedAt" TIMESTAMPTZ NOT NULL, "finishedAt" TIMESTAMPTZ,
      "rowsRead" INTEGER NOT NULL DEFAULT 0 CHECK ("rowsRead" >= 0),
      "rowsAccepted" INTEGER NOT NULL DEFAULT 0 CHECK ("rowsAccepted" >= 0),
      "rowsRejected" INTEGER NOT NULL DEFAULT 0 CHECK ("rowsRejected" >= 0),
      "errorMessage" TEXT, "isDemoData" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMPTZ NOT NULL, "updatedAt" TIMESTAMPTZ NOT NULL,
      CHECK ("rowsAccepted" + "rowsRejected" <= "rowsRead"),
      CHECK ("finishedAt" IS NULL OR "finishedAt" >= "startedAt")
    );
    CREATE TABLE academic.timeline_programs (
      id VARCHAR(255) PRIMARY KEY, name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL, owner VARCHAR(255) NOT NULL,
      "regionId" VARCHAR(255) REFERENCES directory.regions(id) ON DELETE RESTRICT,
      "startDate" DATE NOT NULL, "endDate" DATE NOT NULL,
      status VARCHAR(20) NOT NULL CHECK (status IN ('planned','ongoing','completed')),
      progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
      "isDemoData" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMPTZ NOT NULL, "updatedAt" TIMESTAMPTZ NOT NULL,
      CHECK ("endDate" >= "startDate")
    );
    CREATE TABLE directory.institution_links (
      id VARCHAR(255) PRIMARY KEY,
      "universityId" VARCHAR(255) NOT NULL REFERENCES directory.universities(id) ON DELETE RESTRICT,
      "partnerName" VARCHAR(255) NOT NULL,
      "partnerType" VARCHAR(20) NOT NULL CHECK ("partnerType" IN ('education','industry','government')),
      status VARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')),
      "startDate" DATE NOT NULL, "endDate" DATE,
      "projectCount" INTEGER NOT NULL DEFAULT 0 CHECK ("projectCount" >= 0),
      "isDemoData" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMPTZ NOT NULL, "updatedAt" TIMESTAMPTZ NOT NULL,
      CHECK ("endDate" IS NULL OR "endDate" >= "startDate")
    );
    CREATE TABLE analytics.report_definitions (
      id VARCHAR(255) PRIMARY KEY, name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL, description TEXT,
      "defaultFormat" VARCHAR(10) NOT NULL CHECK ("defaultFormat" IN ('PDF','XLSX','CSV')),
      "snapshotId" VARCHAR(255) REFERENCES analytics.snapshots(id) ON DELETE RESTRICT,
      "isActive" BOOLEAN NOT NULL DEFAULT TRUE, "isDemoData" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMPTZ NOT NULL, "updatedAt" TIMESTAMPTZ NOT NULL
    );
  `, { transaction });
}

export async function down(sequelize: Sequelize, transaction: Transaction) {
  // Never discard user records when reverting this additive migration.
  for (const [schema, table] of [...cardTables].reverse()) {
    await sequelize.query(`LOCK TABLE "${schema}"."${table}" IN ACCESS EXCLUSIVE MODE`, { transaction });
    const rows = await sequelize.query<{ present: boolean }>(
      `SELECT EXISTS (SELECT 1 FROM "${schema}"."${table}") AS present`,
      { type: QueryTypes.SELECT, transaction },
    );
    if (rows[0].present) throw new Error(`Cannot undo: ${schema}.${table} still contains data.`);
  }
  for (const [schema, table] of [...cardTables].reverse()) {
    await sequelize.query(`DROP TABLE "${schema}"."${table}"`, { transaction });
  }
}
