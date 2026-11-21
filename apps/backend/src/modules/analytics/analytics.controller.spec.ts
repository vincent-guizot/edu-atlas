import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  const mockAnalyticsService = {
    getEnrollmentAnalytics: jest.fn().mockResolvedValue([
      { year: 2021, enrollment_sd: 1200000 },
      { year: 2026, enrollment_sd: 1450000 },
    ]),
    getGraduationAnalytics: jest.fn().mockResolvedValue({
      trends: [],
      levelGraduationRates: [
        { level: 'SD', rate: 99.4, dropoutRate: 0.6 },
        { level: 'SMP', rate: 98.7, dropoutRate: 1.3 },
      ],
    }),
    getPerformanceAnalytics: jest.fn().mockResolvedValue({
      regionalScores: [],
      radarCategories: [
        { metric: 'Kualitas Guru', max: 100 },
        { metric: 'Kelayakan Fasilitas', max: 100 },
      ],
      radarData: [],
    }),
    getDistributionAnalytics: jest.fn().mockResolvedValue({
      byIsland: [
        { island: 'Jawa', schools: 5000, students: 2500000, teachers: 150000, universities: 150, studentTeacherRatio: 16.7 },
      ],
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return enrollment analytics array', async () => {
    const result = await controller.getEnrollment();
    expect(service.getEnrollmentAnalytics).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });

  it('should return graduation analytics with level rates', async () => {
    const result = await controller.getGraduation();
    expect(service.getGraduationAnalytics).toHaveBeenCalled();
    expect(result.levelGraduationRates).toHaveLength(2);
    expect(result.levelGraduationRates[0].rate).toBe(99.4);
  });

  it('should return performance radar analytics', async () => {
    const result = await controller.getPerformance();
    expect(service.getPerformanceAnalytics).toHaveBeenCalled();
    expect(result.radarCategories).toHaveLength(2);
  });

  it('should return island distribution analytics', async () => {
    const result = await controller.getDistribution();
    expect(service.getDistributionAnalytics).toHaveBeenCalled();
    expect(result.byIsland[0].island).toBe('Jawa');
    expect(result.byIsland[0].studentTeacherRatio).toBe(16.7);
  });
});
