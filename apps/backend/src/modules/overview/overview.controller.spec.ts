import { Test, TestingModule } from '@nestjs/testing';
import { OverviewController } from './overview.controller';
import { OverviewService } from './overview.service';

describe('OverviewController', () => {
  let controller: OverviewController;
  let service: OverviewService;

  const mockOverviewData = {
    snapshot: {
      snapshotDate: '2026-10-20T00:00:00.000Z',
      period: '2026',
      source: 'EduAtlas Demo Dataset',
      isDemoData: true,
    },
    kpi: {
      totalSchools: 12500,
      totalStudents: 4250000,
      totalTeachers: 285000,
      totalUniversities: 320,
      studentTeacherRatio: 14.9,
    },
    levelDistribution: [
      { level: 'SD (Sekolah Dasar)', count: 7250, students: 2040000 },
    ],
    enrollmentTrend: [
      { year: 2021, totalStudents: 3800000 },
      { year: 2026, totalStudents: 4250000 },
    ],
    regionalSummary: [],
  };

  const mockOverviewService = {
    getOverviewData: jest.fn().mockResolvedValue(mockOverviewData),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OverviewController],
      providers: [
        {
          provide: OverviewService,
          useValue: mockOverviewService,
        },
      ],
    }).compile();

    controller = module.get<OverviewController>(OverviewController);
    service = module.get<OverviewService>(OverviewService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getOverviewData with default period', async () => {
    const result = await controller.getOverview();
    expect(service.getOverviewData).toHaveBeenCalledWith(undefined, undefined);
    expect(result).toEqual(mockOverviewData);
    expect(result.kpi.totalSchools).toBe(12500);
  });

  it('should pass period and regionId when provided', async () => {
    await controller.getOverview('2025', 'reg-jawa-barat');
    expect(service.getOverviewData).toHaveBeenCalledWith('2025', 'reg-jawa-barat');
  });
});
