import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

export const domainTables = [
  ['directory', 'regions'], ['directory', 'schools'], ['directory', 'universities'],
  ['academic', 'academic_programs'], ['academic', 'academic_events'],
  ['analytics', 'education_indicators'], ['analytics', 'snapshots'],
] as const;

async function relocate(sequelize: Sequelize, transaction: Transaction, undo: boolean) {
  for (const [schema, table] of domainTables) {
    const source = undo ? schema : 'public';
    const target = undo ? 'public' : schema;
    const [rows] = await sequelize.query(
      'SELECT to_regclass($1) AS source, to_regclass($2) AS target',
      { bind: [`${source}.${table}`, `${target}.${table}`], transaction },
    );
    const state = rows[0] as { source: string | null; target: string | null };
    if (state.source && state.target) {
      throw new Error(`Both ${source}.${table} and ${target}.${table} exist; reconcile them before migration.`);
    }
    if (state.source) {
      await sequelize.query(`ALTER TABLE "${source}"."${table}" SET SCHEMA "${target}"`, { transaction });
    }
  }
}
export async function up(sequelize: Sequelize, transaction: Transaction) {
  await sequelize.query('CREATE SCHEMA IF NOT EXISTS directory; CREATE SCHEMA IF NOT EXISTS academic; CREATE SCHEMA IF NOT EXISTS analytics;', { transaction });
  await relocate(sequelize, transaction, false);
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS directory.regions (
      id VARCHAR(255) PRIMARY KEY, name VARCHAR(255) NOT NULL,
      island VARCHAR(255) NOT NULL, capital VARCHAR(255) NOT NULL,
      latitude FLOAT NOT NULL, longitude FLOAT NOT NULL,
      "totalSchools" INTEGER DEFAULT 0, "totalStudents" INTEGER DEFAULT 0,
      "totalTeachers" INTEGER DEFAULT 0, "totalUniversities" INTEGER DEFAULT 0,
      "avgPerformanceScore" FLOAT DEFAULT 75,
      "accreditationA" INTEGER DEFAULT 0, "accreditationB" INTEGER DEFAULT 0,
      "accreditationC" INTEGER DEFAULT 0,
      "createdAt" TIMESTAMPTZ NOT NULL, "updatedAt" TIMESTAMPTZ NOT NULL
    );
    DO $$ BEGIN
      CREATE TYPE directory."enum_schools_educationLevel" AS ENUM ('SD','SMP','SMA','SMK');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE directory.enum_schools_ownership AS ENUM ('Negeri','Swasta');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE directory.enum_universities_type AS ENUM ('PTN','PTS','PTKIN','Politeknik');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE academic.enum_academic_events_category AS ENUM ('Akademik','Ujian','Libur','Pendaftaran','Milestone');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE academic.enum_academic_events_status AS ENUM ('Upcoming','Ongoing','Completed');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    CREATE TABLE IF NOT EXISTS directory.schools (
      id VARCHAR(255) PRIMARY KEY, name VARCHAR(255) NOT NULL,
      npsn VARCHAR(255) NOT NULL UNIQUE,
      "educationLevel" directory."enum_schools_educationLevel" NOT NULL,
      ownership directory.enum_schools_ownership NOT NULL,
      "regionId" VARCHAR(255) NOT NULL REFERENCES directory.regions(id) ON UPDATE CASCADE ON DELETE RESTRICT,
      "regionName" VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL,
      latitude FLOAT NOT NULL, longitude FLOAT NOT NULL,
      "studentCount" INTEGER DEFAULT 0, "teacherCount" INTEGER DEFAULT 0,
      accreditation VARCHAR(255) DEFAULT 'B', "facilitiesScore" FLOAT DEFAULT 80,
      "isDemoData" BOOLEAN DEFAULT TRUE,
      "createdAt" TIMESTAMPTZ NOT NULL, "updatedAt" TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS directory.universities (
      id VARCHAR(255) PRIMARY KEY, name VARCHAR(255) NOT NULL,
      code VARCHAR(255) NOT NULL, type directory.enum_universities_type NOT NULL,
      "regionId" VARCHAR(255) NOT NULL REFERENCES directory.regions(id) ON UPDATE CASCADE ON DELETE RESTRICT,
      "regionName" VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL,
      latitude FLOAT NOT NULL, longitude FLOAT NOT NULL,
      "facultyCount" INTEGER DEFAULT 1, "programCount" INTEGER DEFAULT 1,
      "studentCount" INTEGER DEFAULT 0, "lecturerCount" INTEGER DEFAULT 0,
      accreditation VARCHAR(255) DEFAULT 'Unggul', "nationalRank" INTEGER,
      "isDemoData" BOOLEAN DEFAULT TRUE,
      "createdAt" TIMESTAMPTZ NOT NULL, "updatedAt" TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS academic.academic_programs (
      id VARCHAR(255) PRIMARY KEY,
      "universityId" VARCHAR(255) NOT NULL REFERENCES directory.universities(id) ON UPDATE CASCADE ON DELETE CASCADE,
      "universityName" VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL,
      degree VARCHAR(255) NOT NULL, faculty VARCHAR(255) NOT NULL,
      "studentCount" INTEGER DEFAULT 0, "graduationRate" FLOAT DEFAULT 85,
      "avgStudyDuration" FLOAT DEFAULT 4,
      "createdAt" TIMESTAMPTZ NOT NULL, "updatedAt" TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS analytics.education_indicators (
      id VARCHAR(255) PRIMARY KEY, year INTEGER NOT NULL,
      period VARCHAR(255) NOT NULL, "metricName" VARCHAR(255) NOT NULL,
      value FLOAT NOT NULL, category VARCHAR(255) NOT NULL, metadata JSONB,
      "createdAt" TIMESTAMPTZ NOT NULL, "updatedAt" TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS academic.academic_events (
      id VARCHAR(255) PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT,
      "startDate" VARCHAR(255) NOT NULL, "endDate" VARCHAR(255) NOT NULL,
      category academic.enum_academic_events_category NOT NULL,
      status academic.enum_academic_events_status DEFAULT 'Upcoming',
      "targetAudience" VARCHAR(255) DEFAULT 'Semua', color VARCHAR(255),
      "createdAt" TIMESTAMPTZ NOT NULL, "updatedAt" TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS analytics.snapshots (
      id VARCHAR(255) PRIMARY KEY, "snapshotDate" TIMESTAMPTZ NOT NULL,
      period VARCHAR(255) NOT NULL, source VARCHAR(255) DEFAULT 'EduAtlas Demo Dataset',
      version VARCHAR(255) DEFAULT '1.0.0', "isDemoData" BOOLEAN DEFAULT TRUE,
      "totalSchools" INTEGER NOT NULL DEFAULT 0, "totalStudents" INTEGER NOT NULL DEFAULT 0,
      "totalTeachers" INTEGER NOT NULL DEFAULT 0, "totalUniversities" INTEGER NOT NULL DEFAULT 0,
      notes TEXT, "createdAt" TIMESTAMPTZ NOT NULL, "updatedAt" TIMESTAMPTZ NOT NULL
    );
  `, { transaction });
}

export async function down(sequelize: Sequelize, transaction: Transaction) {
  // Restore the previous layout while retaining all domain rows and enum types.
  await relocate(sequelize, transaction, true);
}
