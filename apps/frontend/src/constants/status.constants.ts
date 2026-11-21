export interface ServiceHealthStatus {
  service: string;
  endpoint: string;
  status: 'Online' | 'Degraded' | 'Offline';
  latencyMs: number;
  lastChecked: string;
}

export const SYSTEM_STATUS_SNAPSHOT: ServiceHealthStatus[] = [
  {
    service: 'Core Overview Service',
    endpoint: '/api/v1/overview',
    status: 'Online',
    latencyMs: 42,
    lastChecked: '20 Okt 2026, 10:24 WIB',
  },
  {
    service: 'Schools & Registry Service',
    endpoint: '/api/v1/schools',
    status: 'Online',
    latencyMs: 58,
    lastChecked: '20 Okt 2026, 10:24 WIB',
  },
  {
    service: 'Universities Service',
    endpoint: '/api/v1/universities',
    status: 'Online',
    latencyMs: 64,
    lastChecked: '20 Okt 2026, 10:24 WIB',
  },
  {
    service: 'Indicators & Analytics Service',
    endpoint: '/api/v1/analytics',
    status: 'Online',
    latencyMs: 71,
    lastChecked: '20 Okt 2026, 10:24 WIB',
  },
  {
    service: 'Calendar & Schedules Service',
    endpoint: '/api/v1/calendar',
    status: 'Online',
    latencyMs: 38,
    lastChecked: '20 Okt 2026, 10:24 WIB',
  },
  {
    service: 'Reports & Export Generator',
    endpoint: '/api/v1/reports',
    status: 'Online',
    latencyMs: 85,
    lastChecked: '20 Okt 2026, 10:24 WIB',
  },
  {
    service: 'PostgreSQL Relational Database',
    endpoint: 'postgresql://localhost:5432/eduatlas_db',
    status: 'Online',
    latencyMs: 12,
    lastChecked: '20 Okt 2026, 10:24 WIB',
  },
];
