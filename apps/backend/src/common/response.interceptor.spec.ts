import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { ResponseTransformInterceptor } from './response.interceptor';

describe('ResponseTransformInterceptor', () => {
  let interceptor: ResponseTransformInterceptor<any>;

  beforeEach(() => {
    interceptor = new ResponseTransformInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should wrap standard response in data and meta envelope', (done) => {
    const mockContext = {} as ExecutionContext;
    const mockData = { message: 'success', value: 42 };
    const mockHandler: CallHandler = {
      handle: () => of(mockData),
    };

    interceptor.intercept(mockContext, mockHandler).subscribe((response) => {
      expect(response).toBeDefined();
      expect(response.data).toEqual(mockData);
      expect(response.meta).toBeDefined();
      expect(response.meta.snapshotId).toBe('snp-2026-10-20');
      expect(response.meta.period).toBe('2026');
      expect(response.meta.source).toBe('EduAtlas Demo Dataset');
      expect(response.meta.isDemoData).toBe(true);
      done();
    });
  });

  it('should format paginated data with pagination metadata', (done) => {
    const mockContext = {} as ExecutionContext;
    const paginatedPayload = {
      count: 50,
      rows: [{ id: '1' }, { id: '2' }],
      page: 1,
      limit: 10,
    };
    const mockHandler: CallHandler = {
      handle: () => of(paginatedPayload),
    };

    interceptor.intercept(mockContext, mockHandler).subscribe((response) => {
      expect(response.data).toEqual(paginatedPayload.rows);
      expect(response.meta.pagination).toBeDefined();
      expect(response.meta.pagination?.total).toBe(50);
      expect(response.meta.pagination?.page).toBe(1);
      expect(response.meta.pagination?.limit).toBe(10);
      expect(response.meta.pagination?.totalPages).toBe(5);
      done();
    });
  });

  it('should pass through already enveloped data without double wrapping', (done) => {
    const mockContext = {} as ExecutionContext;
    const alreadyWrapped = {
      data: { id: 'custom' },
      meta: {
        snapshotId: 'custom-snp',
        snapshotDate: '2026-10-20T00:00:00.000Z',
        period: '2026',
        source: 'Custom Source',
        isDemoData: false,
      },
    };
    const mockHandler: CallHandler = {
      handle: () => of(alreadyWrapped),
    };

    interceptor.intercept(mockContext, mockHandler).subscribe((response) => {
      expect(response).toEqual(alreadyWrapped);
      done();
    });
  });
});
