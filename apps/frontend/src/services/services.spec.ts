import { describe, it, expect } from 'vitest';
import { overviewService } from './overview.service';
import { schoolsService } from './schools.service';
import { universitiesService } from './universities.service';
import { calendarService } from './calendar.service';
import { reportsService } from './reports.service';
import { statusService } from './status.service';

describe('Services with Offline Constants Fallback', () => {
  it('overviewService should return complete snapshot fallback data when offline', async () => {
    const data = await overviewService.getOverviewData('2026');
    expect(data).toBeDefined();
    expect(data.kpi).toBeDefined();
    expect(data.trendData.length).toBeGreaterThan(0);
    expect(data.distributionData.length).toBe(4);
    expect(data.topProvinces.length).toBe(10);
    expect(data.snapshotInfo.id).toBe('snp-2026-10-20');
  });

  it('schoolsService should return fallback schools data and support filtering', async () => {
    const all = await schoolsService.getSchools();
    expect(all.items.length).toBeGreaterThan(0);
    expect(all.total).toBe(all.items.length);

    const smaOnly = await schoolsService.getSchools({ stage: 'SMA' });
    expect(smaOnly.items.every((s) => s.stage === 'SMA')).toBe(true);

    const searchRes = await schoolsService.getSchools({ search: 'Bandung' });
    expect(searchRes.items.length).toBeGreaterThan(0);
  });

  it('universitiesService should return fallback universities data and support filtering', async () => {
    const all = await universitiesService.getUniversities();
    expect(all.items.length).toBeGreaterThan(0);

    const ptnOnly = await universitiesService.getUniversities({ type: 'PTN-BH' });
    expect(ptnOnly.items.every((u) => u.type === 'PTN-BH')).toBe(true);
  });

  it('calendarService should return academic calendar events', async () => {
    const events = await calendarService.getEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toHaveProperty('title');
    expect(events[0]).toHaveProperty('category');
  });

  it('reportsService should return report catalog', async () => {
    const reports = await reportsService.getReports();
    expect(reports.length).toBeGreaterThan(0);
    expect(reports[0]).toHaveProperty('title');
    expect(reports[0]).toHaveProperty('format');
  });

  it('statusService should return service health statuses', async () => {
    const statuses = await statusService.getStatus();
    expect(statuses.length).toBeGreaterThan(0);
    expect(statuses[0]).toHaveProperty('service');
    expect(statuses[0]).toHaveProperty('status');
  });
});
