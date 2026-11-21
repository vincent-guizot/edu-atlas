import { Sequelize } from 'sequelize-typescript';
import { seedOwnedData } from './owned-seed';
import { seedDemoData } from './education-demo';
import { SEED_REGIONS, SEED_UNIVERSITIES } from '../seed.data';

export async function seedCardDemoData(sequelize: Sequelize, undo = false) {
  return seedOwnedData(sequelize, 'card-demo-v1', () => [
    ['DataSource', [
      { id: 'demo-source-schools', name: 'Demo School Snapshot', provider: 'EduAtlas Demo', sourceType: 'snapshot' },
      { id: 'demo-source-universities', name: 'Demo University Snapshot', provider: 'EduAtlas Demo', sourceType: 'file' },
    ]],
    ['DataImport', [
      { id: 'demo-import-schools', sourceId: 'demo-source-schools', status: 'completed',
        startedAt: new Date('2026-10-20T08:00:00Z'), finishedAt: new Date('2026-10-20T08:01:00Z'),
        rowsRead: 25, rowsAccepted: 24, rowsRejected: 1 },
      { id: 'demo-import-universities', sourceId: 'demo-source-universities', status: 'failed',
        startedAt: new Date('2026-10-20T09:00:00Z'), finishedAt: new Date('2026-10-20T09:00:05Z'),
        rowsRead: 0, errorMessage: 'Simulated validation failure; no external source contacted.' },
    ]],
    ['TimelineProgram', [
      { id: 'demo-program-digital', name: 'Demo Digital Classroom', category: 'Infrastructure', owner: 'Demo Education Office',
        regionId: SEED_REGIONS[0].id, startDate: '2026-01-01', endDate: '2026-12-31', status: 'ongoing', progress: 65 },
      { id: 'demo-program-teachers', name: 'Demo Teacher Workshop', category: 'Training', owner: 'Demo Training Team',
        startDate: '2026-02-01', endDate: '2026-08-31', status: 'completed', progress: 100 },
    ]],
    ['InstitutionLink', [
      { id: 'demo-link-industry', universityId: SEED_UNIVERSITIES[0].id, partnerName: 'Demo Industry Partner',
        partnerType: 'industry', status: 'active', startDate: '2026-01-01', projectCount: 3 },
      { id: 'demo-link-government', universityId: SEED_UNIVERSITIES[1].id, partnerName: 'Demo Regional Office',
        partnerType: 'government', status: 'inactive', startDate: '2025-01-01', endDate: '2025-12-31', projectCount: 1 },
    ]],
    ['ReportDefinition', [
      { id: 'demo-report-national', name: 'Demo National Summary', category: 'Executive', defaultFormat: 'PDF',
        snapshotId: 'snp-2026-10-20', description: 'Demo report definition; no generated file is implied.' },
      { id: 'demo-report-directory', name: 'Demo Institution Directory', category: 'Directory', defaultFormat: 'CSV' },
    ]],
  ], undo);
}

export async function seedAllDemoData(sequelize: Sequelize, undo = false) {
  // Undo dependencies before their parent institution and snapshot records.
  if (undo) {
    await seedCardDemoData(sequelize, true);
    await seedDemoData(sequelize, true);
  } else {
    await seedDemoData(sequelize);
    await seedCardDemoData(sequelize);
  }
}
