import { Sequelize } from 'sequelize-typescript';
import { seedOwnedData } from './owned-seed';
import {
  SEED_REGIONS, SEED_SCHOOLS, SEED_UNIVERSITIES,
  SEED_ACADEMIC_PROGRAMS, SEED_INDICATORS, SEED_ACADEMIC_EVENTS,
} from '../seed.data';

export async function seedDemoData(sequelize: Sequelize, undo = false) {
  return seedOwnedData(sequelize, 'education-demo-v2', () => {
    const sum = (key: string) => SEED_REGIONS.reduce((total, row) => total + row[key], 0);
    return [
      ['Region', SEED_REGIONS], ['School', SEED_SCHOOLS],
      ['University', SEED_UNIVERSITIES], ['AcademicProgram', SEED_ACADEMIC_PROGRAMS],
      ['EducationIndicator', SEED_INDICATORS], ['AcademicEvent', SEED_ACADEMIC_EVENTS],
      ['Snapshot', [{
        id: 'snp-2026-10-20', snapshotDate: new Date('2026-10-20T00:00:00Z'),
        period: '2026', source: 'EduAtlas Demo Dataset', version: '2.0.0', isDemoData: true,
        totalSchools: sum('totalSchools'), totalStudents: sum('totalStudents'),
        totalTeachers: sum('totalTeachers'), totalUniversities: sum('totalUniversities'),
        notes: 'Simulated regional aggregates; institution directory is a sample, not national coverage.',
      }]],
    ];
  }, undo);
}
