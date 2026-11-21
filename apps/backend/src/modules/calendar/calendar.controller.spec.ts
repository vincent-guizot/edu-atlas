import { Test, TestingModule } from '@nestjs/testing';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

describe('CalendarController', () => {
  let controller: CalendarController;
  let service: CalendarService;

  const mockEvents = [
    {
      id: 'evt-001',
      title: 'Pelaksanaan UTBK-SNBT Gelombang 1',
      startDate: '2026-05-02',
      endDate: '2026-05-07',
      category: 'Ujian',
      status: 'Upcoming',
    },
  ];

  const mockCalendarService = {
    findAll: jest.fn().mockResolvedValue(mockEvents),
    getUpcoming: jest.fn().mockResolvedValue(mockEvents),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [
        {
          provide: CalendarService,
          useValue: mockCalendarService,
        },
      ],
    }).compile();

    controller = module.get<CalendarController>(CalendarController);
    service = module.get<CalendarService>(CalendarService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return calendar events matching filter criteria', async () => {
    const result = await controller.findAll('Ujian', 'Upcoming', 'Semua');
    expect(service.findAll).toHaveBeenCalledWith({
      category: 'Ujian',
      status: 'Upcoming',
      targetAudience: 'Semua',
    });
    expect(result).toEqual(mockEvents);
  });

  it('should return upcoming events', async () => {
    const result = await controller.getUpcoming();
    expect(service.getUpcoming).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].title).toContain('UTBK-SNBT');
  });
});
