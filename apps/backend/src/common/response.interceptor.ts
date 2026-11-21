import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  data: T;
  meta: {
    snapshotId: string;
    snapshotDate: string;
    period: string;
    source: string;
    isDemoData: boolean;
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((resData) => {
        // If data is already formatted or has its own pagination/meta
        if (resData && typeof resData === 'object' && 'data' in resData && 'meta' in resData) {
          return resData;
        }

        const isPaginated = resData && resData.rows && typeof resData.count === 'number';
        const data = isPaginated ? resData.rows : resData;
        const pagination = isPaginated
          ? {
              total: resData.count,
              page: resData.page || 1,
              limit: resData.limit || 10,
              totalPages: Math.ceil(resData.count / (resData.limit || 10)),
            }
          : undefined;

        return {
          data,
          meta: {
            snapshotId: 'snp-2026-10-20',
            snapshotDate: new Date('2026-10-20T00:00:00.000Z').toISOString(),
            period: '2026',
            source: 'EduAtlas Demo Dataset',
            isDemoData: true,
            ...(pagination ? { pagination } : {}),
          },
        };
      }),
    );
  }
}
