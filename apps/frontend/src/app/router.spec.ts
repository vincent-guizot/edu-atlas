import { describe, it, expect } from 'vitest';
import { router } from './router';

describe('App Router', () => {
  it('should be initialized via createBrowserRouter', () => {
    expect(router).toBeDefined();
    expect(router.routes).toBeDefined();
    expect(router.routes.length).toBeGreaterThan(0);
  });

  it('should define root route with children for all 12 dashboard pages', () => {
    const rootRoute = router.routes[0];
    expect(rootRoute.path).toBe('/');
    expect(rootRoute.children).toBeDefined();

    const paths = (rootRoute.children || []).map((child: any) => child.path || (child.index ? 'index' : ''));
    expect(paths).toContain('overview');
    expect(paths).toContain('visualizations');
    expect(paths).toContain('visualizations/advanced');
    expect(paths).toContain('maps');
    expect(paths).toContain('maps/advanced');
    expect(paths).toContain('data-explorer');
    expect(paths).toContain('data-grid');
    expect(paths).toContain('calendar');
    expect(paths).toContain('timeline');
    expect(paths).toContain('flow');
    expect(paths).toContain('data-status');
    expect(paths).toContain('reports');
  });
});
