import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockSummary = {
    period: '2026',
    title: 'Laporan Eksekutif Capaian Pendidikan Nasional 2026',
    narrative: 'Sektor pendidikan Indonesia pada semester aktif 2026 menunjukkan peningkatan...',
    highlights: [
      { metric: 'Angka Partisipasi Murni', value: '98,7%' },
    ],
  };

  const mockExportData = {
    type: 'all',
    schools: [],
    universities: [],
    regions: [],
  };

  const mockReportsService = {
    getExecutiveSummary: jest.fn().mockResolvedValue(mockSummary),
    getExportData: jest.fn().mockResolvedValue(mockExportData),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return executive summary report for period', async () => {
    const result = await controller.getSummary('2026');
    expect(service.getExecutiveSummary).toHaveBeenCalledWith('2026');
    expect(result).toEqual(mockSummary);
    expect(result.period).toBe('2026');
  });

  it('should return export-compatible datasets', async () => {
    const result = await controller.getExportData('all');
    expect(service.getExportData).toHaveBeenCalledWith('all');
    expect(result).toEqual(mockExportData);
  });
});
