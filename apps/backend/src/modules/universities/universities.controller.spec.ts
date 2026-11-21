import { Test, TestingModule } from '@nestjs/testing';
import { UniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';

describe('UniversitiesController', () => {
  let controller: UniversitiesController;
  let service: UniversitiesService;

  const mockUniversityList = {
    count: 1,
    rows: [
      {
        id: 'uni-ui',
        name: 'Universitas Indonesia',
        code: 'UI',
        type: 'PTN',
        accreditation: 'Unggul',
        programs: [],
      },
    ],
  };

  const mockUniversityDetail = {
    id: 'uni-ui',
    name: 'Universitas Indonesia',
    code: 'UI',
    type: 'PTN',
    accreditation: 'Unggul',
    nationalRank: 1,
    programs: [
      { id: 'prg-01', name: 'Ilmu Komputer', degree: 'S1' },
    ],
  };

  const mockUniversitiesService = {
    findAll: jest.fn().mockResolvedValue(mockUniversityList),
    findById: jest.fn().mockResolvedValue(mockUniversityDetail),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UniversitiesController],
      providers: [
        {
          provide: UniversitiesService,
          useValue: mockUniversitiesService,
        },
      ],
    }).compile();

    controller = module.get<UniversitiesController>(UniversitiesController);
    service = module.get<UniversitiesService>(UniversitiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return paginated universities with program count', async () => {
    const result = await controller.findAll(1, 10, 'UI', 'reg-jabar', 'PTN', 'Unggul');
    expect(service.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      search: 'UI',
      regionId: 'reg-jabar',
      type: 'PTN',
      accreditation: 'Unggul',
    });
    expect(result).toEqual(mockUniversityList);
    expect(result.rows[0].code).toBe('UI');
  });

  it('should return university detail with programs by id', async () => {
    const result = await controller.findById('uni-ui');
    expect(service.findById).toHaveBeenCalledWith('uni-ui');
    expect(result).toEqual(mockUniversityDetail);
    expect(result.programs).toHaveLength(1);
  });
});
