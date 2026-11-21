import { Client } from 'pg';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { applyMigrations, getSequelizeInstance } from '../scripts/migrate';
import { dbHost, dbPort, dbUser, dbPassword } from '../scripts/db-config';
import { seedDemoData } from '../seeders/education-demo';
import { seedAllDemoData } from '../seeders/card-demo';
import { CardsService } from '../../modules/cards/cards.service';
import { CardsController } from '../../modules/cards/cards.controller';
import { SEED_REGIONS, SEED_SCHOOLS, SEED_ACADEMIC_PROGRAMS } from '../seed.data';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/sequelize';
import request = require('supertest');
import { PageCardsController } from '../../modules/cards/page-cards.controller';
import { PageCardsService } from '../../modules/cards/page-cards.service';
import { pageCardCatalog } from '../../modules/cards/page-card-catalog';
import { ResponseTransformInterceptor } from '../../common/response.interceptor';

const integration = process.env.DB_INTEGRATION_TEST === 'true' ? describe : describe.skip;

integration('multi-schema migrations and owned demo seed in disposable PostgreSQL', () => {
  const database = `eduatlas_verify_${process.pid}_${Date.now()}`;
  const admin = new Client({
    host: dbHost, port: dbPort, user: dbUser, password: dbPassword, database: 'postgres',
  });
  let sequelize: Sequelize;
  let app: INestApplication;
  let created = false;

  beforeAll(async () => {
    await admin.connect();
    await admin.query(`CREATE DATABASE "${database}"`);
    created = true;
    sequelize = getSequelizeInstance(database);
    sequelize.options.logging = false;
    await sequelize.authenticate();
    const module = await Test.createTestingModule({
      controllers: [PageCardsController, CardsController],
      providers: [PageCardsService, CardsService, { provide: getConnectionToken(), useValue: sequelize }],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    await app.init();
  }, 30000);

  beforeEach(async () => {
    if (sequelize.getDatabaseName() !== database || !/^eduatlas_verify_\d+_\d+$/.test(database)) {
      throw new Error('Fixture reset requires the disposable verification database.');
    }
    await sequelize.query(`
      DROP SCHEMA IF EXISTS directory CASCADE; DROP SCHEMA IF EXISTS academic CASCADE;
      DROP SCHEMA IF EXISTS analytics CASCADE; DROP SCHEMA IF EXISTS system CASCADE;
      DROP SCHEMA public CASCADE; CREATE SCHEMA public;
    `);
    await applyMigrations(sequelize);
  });

  afterAll(async () => {
    if (app) await app.close();
    if (sequelize) await sequelize.close();
    if (created && /^eduatlas_verify_\d+_\d+$/.test(database)) {
      await admin.query(`DROP DATABASE "${database}"`);
    }
    await admin.end();
  });

  it('creates four schemas with fourteen tables and records both versions once', async () => {
    await applyMigrations(sequelize);
    const tables = await sequelize.query<{ schema: string; count: number }>(
      `SELECT table_schema AS schema, count(*)::int AS count FROM information_schema.tables
       WHERE table_schema IN ('directory','academic','analytics','system') GROUP BY table_schema ORDER BY table_schema`,
      { type: QueryTypes.SELECT },
    );
    expect(tables).toEqual([
      { schema: 'academic', count: 3 }, { schema: 'analytics', count: 3 },
      { schema: 'directory', count: 4 }, { schema: 'system', count: 4 },
    ]);
    expect((await sequelize.query('SELECT * FROM system.schema_migrations', {
      type: QueryTypes.SELECT,
    })).length).toBe(2);
  });

  it('serializes concurrent migration and seed runs without duplicates', async () => {
    await Promise.all([applyMigrations(sequelize), applyMigrations(sequelize)]);
    await Promise.all([seedDemoData(sequelize), seedDemoData(sequelize)]);
    expect(await sequelize.model('Region').count()).toBe(SEED_REGIONS.length);
    expect(await sequelize.model('School').count()).toBe(SEED_SCHOOLS.length);
    const schools = await sequelize.model('School').findAll({ include: [sequelize.model('Region')], limit: 1 });
    expect(schools[0].get('region')).toBeTruthy();
  });

  it('skips a completed seed and preserves edits', async () => {
    await seedDemoData(sequelize);
    await sequelize.model('Region').update({ name: 'Preserved edit' }, { where: { id: SEED_REGIONS[0].id } });
    const queries: string[] = [];
    sequelize.options.logging = sql => queries.push(sql);
    try {
      await seedDemoData(sequelize);
    } finally {
      sequelize.options.logging = false;
    }
    expect(queries).toHaveLength(4); // BEGIN, lock, seed lookup, COMMIT
    expect(queries.some(sql => sql.includes('INSERT'))).toBe(false);
    expect((await sequelize.model('Region').findByPk(SEED_REGIONS[0].id)).get('name')).toBe('Preserved edit');
    expect(await sequelize.model('Snapshot').count()).toBe(1);
  });

  it('rolls back every insert and seed marker on a later foreign key failure', async () => {
    const length = SEED_SCHOOLS.length;
    SEED_SCHOOLS.push({ ...SEED_SCHOOLS[0], id: 'verify-invalid-school', npsn: '99999999', regionId: 'missing' });
    try {
      await expect(seedDemoData(sequelize)).rejects.toThrow();
      expect(await sequelize.model('Region').count()).toBe(0);
      expect((await sequelize.query('SELECT * FROM system.seed_runs', { type: QueryTypes.SELECT })).length).toBe(0);
    } finally {
      SEED_SCHOOLS.splice(length);
    }
  });

  it('undoes only inserted rows, preserving preexisting data, and supports reseeding', async () => {
    await sequelize.model('Region').create({ ...SEED_REGIONS[0] });
    await seedDemoData(sequelize);
    await seedDemoData(sequelize, true);
    expect(await sequelize.model('Region').count()).toBe(1);
    expect(await sequelize.model('School').count()).toBe(0);
    await seedDemoData(sequelize, true);
    await seedDemoData(sequelize);
    expect(await sequelize.model('School').count()).toBe(SEED_SCHOOLS.length);
  });

  it('refuses undo of edited seed rows and rolls back all earlier deletes', async () => {
    await seedDemoData(sequelize);
    await sequelize.model('Region').update({ name: 'Preserved edit' }, { where: { id: SEED_REGIONS[0].id } });
    await expect(seedDemoData(sequelize, true)).rejects.toThrow('has been edited');
    expect(await sequelize.model('Snapshot').count()).toBe(1);
    expect(await sequelize.model('School').count()).toBe(SEED_SCHOOLS.length);
  });

  it('protects new programs from cascade deletion by seed undo', async () => {
    await seedDemoData(sequelize);
    await sequelize.model('AcademicProgram').create({ ...SEED_ACADEMIC_PROGRAMS[0], id: 'user-program' });
    await expect(seedDemoData(sequelize, true)).rejects.toThrow('not owned');
    expect(await sequelize.model('AcademicProgram').findByPk('user-program')).toBeTruthy();
  });

  it('requires seed undo before migration undo', async () => {
    await seedDemoData(sequelize);
    await expect(applyMigrations(sequelize, true)).rejects.toThrow('db:seed:undo');
    expect(await sequelize.model('School').count()).toBe(SEED_SCHOOLS.length);
  });

  it('restores the public layout and upgrades legacy tables and history without losing rows', async () => {
    await sequelize.model('Region').create({ ...SEED_REGIONS[0] });
    await sequelize.model('School').create({ ...SEED_SCHOOLS[0] });
    await applyMigrations(sequelize, true);
    await applyMigrations(sequelize, true);
    await sequelize.query(`ALTER TABLE system.schema_migrations SET SCHEMA public;
      INSERT INTO public.schema_migrations (name) VALUES ('001-initial-schema');`);
    const legacy = await sequelize.query('SELECT id FROM public.schools', { type: QueryTypes.SELECT });
    expect(legacy).toEqual([{ id: SEED_SCHOOLS[0].id }]);
    await applyMigrations(sequelize);
    expect(await sequelize.model('School').count()).toBe(1);
    const row = await sequelize.model('School').findByPk(SEED_SCHOOLS[0].id, { include: [sequelize.model('Region')] });
    expect(row.get('region')).toBeTruthy();
  });

  it('returns five cards with database values and demo provenance, including empty datasets', async () => {
    const controller = new CardsController(new CardsService(sequelize));
    const { data: empty } = await controller.getCards();
    expect(empty).toHaveLength(5);
    expect(empty.every(card => card.value === 0 && card.secondaryValue === 0)).toBe(true);
    await seedAllDemoData(sequelize);
    await seedAllDemoData(sequelize);
    const response = await controller.getCards();
    const cards = response.data;
    expect(response.meta.isDemoData).toBe(true);
    expect(cards.map(card => [card.key, card.value, card.secondaryValue])).toEqual([
      ['sources', 2, 2], ['imports', 1, 24], ['programs', 1, 1],
      ['partnerships', 1, 3], ['reports', 2, 2],
    ]);
    expect(cards.every(card => card.isDemoData)).toBe(true);
    await sequelize.model('InstitutionLink').update({ projectCount: 8 }, { where: { id: 'demo-link-industry' } });
    expect((await controller.getCards()).data.find(card => card.key === 'partnerships').secondaryValue).toBe(8);
  });

  it('validates new table checks and foreign keys in PostgreSQL', async () => {
    await seedAllDemoData(sequelize);
    await expect(sequelize.model('DataImport').create({ id: 'invalid-import', sourceId: 'missing',
      status: 'queued', startedAt: new Date() })).rejects.toThrow();
    await expect(sequelize.model('TimelineProgram').update({ progress: 101 }, {
      where: { id: 'demo-program-digital' },
    })).rejects.toThrow();
    await expect(sequelize.model('InstitutionLink').update({ projectCount: -1 }, {
      where: { id: 'demo-link-industry' },
    })).rejects.toThrow();
    await expect(sequelize.model('DataImport').update({ rowsAccepted: 30 }, {
      where: { id: 'demo-import-schools' },
    })).rejects.toThrow();
  });

  it('undoes card seeds before parents and can revert and reapply the additive migration', async () => {
    await seedAllDemoData(sequelize);
    await seedAllDemoData(sequelize, true);
    expect(await sequelize.model('DataSource').count()).toBe(0);
    expect(await sequelize.model('Region').count()).toBe(0);
    await applyMigrations(sequelize, true);
    expect(await sequelize.query("SELECT to_regclass('system.data_sources') AS relation", {
      type: QueryTypes.SELECT,
    })).toEqual([{ relation: null }]);
    await applyMigrations(sequelize);
    await seedAllDemoData(sequelize);
    expect(await sequelize.model('ReportDefinition').count()).toBe(2);
  });

  it('refuses migration undo when new tables contain untracked user data', async () => {
    await sequelize.model('DataSource').create({ id: 'user-source', name: 'User source',
      provider: 'User', sourceType: 'file', isDemoData: false });
    await expect(applyMigrations(sequelize, true)).rejects.toThrow('still contains data');
    expect(await sequelize.model('DataSource').count()).toBe(1);
  });

  for (const seeded of [false, true]) {
    it(`serves every catalog card over HTTP with ${seeded ? 'seeded' : 'empty'} data and explicit unavailable statuses`, async () => {
      if (seeded) await seedAllDemoData(sequelize);
      const catalog = await request(app.getHttpServer()).get('/api/v1/pages').expect(200);
      expect(catalog.body.data).toHaveLength(12);
      expect(catalog.body.meta.isDemoData).toBeNull();
      for (const page of pageCardCatalog) {
        for (const card of page.cards) {
          const response = await request(app.getHttpServer())
            .get(`/api/v1/pages/${page.id}/cards/${card.id}`).expect(card.query ? 200 : 501);
          if (card.query) {
            expect(response.body.data.cardId).toBe(card.id);
            expect(response.body.data.page).toBe(page.id);
            expect(response.body.meta.tables).toEqual(card.query.tables);
            expect(response.body.meta.snapshotId).toBeUndefined();
          } else {
            expect(response.body.message).toBe(card.unavailableReason);
          }
        }
      }
    }, 30000);
  }

  it('filters one card independently, validates inputs and reports source scope', async () => {
    await seedAllDemoData(sequelize);
    const sql: string[] = [];
    sequelize.options.logging = statement => sql.push(statement);
    let response: request.Response;
    try {
      response = await request(app.getHttpServer())
        .get(`/api/v1/pages/overview/cards/total-schools?regionId=${SEED_REGIONS[0].id}`).expect(200);
    } finally {
      sequelize.options.logging = false;
    }
    expect(response.body.data.result.value).toBe(SEED_REGIONS[0].totalSchools);
    expect(response.body.meta.isDemoData).toBeNull();
    expect(response.body.meta.coverage).toBe('regional-aggregates');
    expect(sql).toHaveLength(1);
    expect(sql[0]).toContain('directory.regions');
    expect(sql[0]).not.toContain('UNION');
    const annual = await request(app.getHttpServer())
      .get('/api/v1/pages/overview/cards/enrollment-trend?year=2026').expect(200);
    expect(annual.body.data.result).toHaveLength(5);
    expect(annual.body.data.result.every(row => row.year === 2026)).toBe(true);
    const limited = await request(app.getHttpServer())
      .get('/api/v1/pages/overview/cards/enrollment-trend?year=2026&limit=1').expect(200);
    expect(limited.body.data.result).toHaveLength(1);
    expect(limited.body.meta.possiblyTruncated).toBe(true);
    for (const suffix of ['?year=2026', '?foo=bar', '?regionId=x&regionId=y', '?regionId=x%27OR%201=1']) {
      await request(app.getHttpServer()).get(`/api/v1/pages/overview/cards/total-schools${suffix}`).expect(400);
    }
    await request(app.getHttpServer()).get('/api/v1/pages/overview/cards/enrollment-trend?year=2026.5').expect(400);
    const missing = await request(app.getHttpServer())
      .get('/api/v1/pages/overview/cards/total-schools?regionId=missing').expect(200);
    expect(missing.body.data.result).toEqual({ value: null, sourceRows: 0 });
  });

  it('bounds list responses, uses explicit dates and distinguishes unknown cards', async () => {
    await seedAllDemoData(sequelize);
    const schools = await request(app.getHttpServer())
      .get('/api/v1/pages/data-explorer/cards/schools-table?limit=1').expect(200);
    expect(schools.body.data.result).toHaveLength(1);
    expect(schools.body.meta.totalRecords).toBe(SEED_SCHOOLS.length);
    expect(schools.body.meta.isDemoData).toBe(true);
    expect(schools.body.data.result[0].__demo).toBeUndefined();
    for (const value of ['0', '101', '1.5', '-1']) {
      await request(app.getHttpServer()).get(`/api/v1/pages/data-explorer/cards/schools-table?limit=${value}`).expect(400);
    }
    const today = await request(app.getHttpServer())
      .get('/api/v1/pages/calendar/cards/agenda-today?date=2026-12-25').expect(200);
    expect(today.body.data.result.length).toBeGreaterThan(0);
    expect(today.body.meta.filters.date).toBe('2026-12-25');
    await request(app.getHttpServer()).get('/api/v1/pages/calendar/cards/agenda-today?date=2026-02-30').expect(400);
    await request(app.getHttpServer()).get('/api/v1/pages/missing/cards').expect(404);
    await request(app.getHttpServer()).get('/api/v1/pages/overview/cards/missing').expect(404);
    const batch = await request(app.getHttpServer()).get('/api/v1/cards').expect(200);
    expect(batch.body.data).toHaveLength(5);
  });
});
