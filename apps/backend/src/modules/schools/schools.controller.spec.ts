import { Test, TestingModule } from '@nestjs/testing';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';

describe('SchoolsController', () => {
  let controller: SchoolsController;
  let service: SchoolsService;

  const mockSchoolsList = {
    count: 2,
    rows: [
      {
        id: 'sch-001',
        name: 'SMAN 8 Jakarta',
        npsn: '20101567',
        educationLevel: 'SMA',
        ownership: 'Negeri',
        accreditation: 'A',
      },
      {
        id: 'sch-002',
        name: 'SMKN 1 Bandung',
        npsn: '20219876',
        educationLevel: 'SMK',
        ownership: 'Negeri',
        accreditation: 'A',
      },
    ],
  };

  const mockSchoolDetail = {
    id: 'sch-001',
    name: 'SMAN 8 Jakarta',
    npsn: '20101567',
    educationLevel: 'SMA',
    ownership: 'Negeri',
    accreditation: 'A',
    facilitiesScore: 94.5,
  };

  const mockSchoolsService = {
    findAll: jest.fn().mockResolvedValue(mockSchoolsList),
    findById: jest.fn().mockResolvedValue(mockSchoolDetail),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolsController],
      providers: [
        {
          provide: SchoolsService,
          useValue: mockSchoolsService,
        },
      ],
    }).compile();

    controller = module.get<SchoolsController>(SchoolsController);
    service = module.get<SchoolsService>(SchoolsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return paginated list of schools', async () => {
    const result = await controller.findAll(1, 10, 'SMAN', 'reg-dki', 'SMA', 'Negeri', 'A');
    expect(service.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      search: 'SMAN',
      regionId: 'reg-dki',
      educationLevel: 'SMA',
      ownership: 'Negeri',
      accreditation: 'A',
    });
    expect(result).toEqual(mockSchoolsList);
    expect(result.rows).toHaveLength(2);
  });

  it('should return a school detail by id', async () => {
    const result = await controller.findById('sch-001');
    expect(service.findById).toHaveBeenCalledWith('sch-001');
    expect(result).toEqual(mockSchoolDetail);
    expect(result.name).toBe('SMAN 8 Jakarta');
  });
});
