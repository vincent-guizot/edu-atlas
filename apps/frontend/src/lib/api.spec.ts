import { describe, it, expect } from 'vitest';
import { apiClient, API_BASE_URL } from './api';

describe('api client', () => {
  it('should have correct default base URL', () => {
    expect(API_BASE_URL).toBe('http://localhost:4000/api/v1');
    expect(apiClient.defaults.baseURL).toBe('http://localhost:4000/api/v1');
  });

  it('should have standard headers and timeout', () => {
    expect(apiClient.defaults.timeout).toBe(15000);
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('should unwrap response data in interceptor', async () => {
    const mockResponse = {
      data: {
        data: { id: 'test' },
        meta: { period: '2026' },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };

    // The fulfilled handler on response interceptor
    const responseHandler = (apiClient.interceptors.response as any).handlers[0].fulfilled;
    const unwrapped = responseHandler(mockResponse);
    expect(unwrapped).toEqual(mockResponse.data);
  });
});
