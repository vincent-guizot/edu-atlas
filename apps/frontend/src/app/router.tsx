import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';

import { OverviewPage } from '../pages/OverviewPage';
import { ChartPlaygroundPage } from '../pages/ChartPlaygroundPage';
import { AdvancedVisualizationPage } from '../pages/AdvancedVisualizationPage';
import { InteractiveMapsPage } from '../pages/InteractiveMapsPage';
import { AdvancedMapsPage } from '../pages/AdvancedMapsPage';
import { DataTablePage } from '../pages/DataTablePage';
import { AdvancedDataGridPage } from '../pages/AdvancedDataGridPage';
import { CalendarPage } from '../pages/CalendarPage';
import { TimelinePage } from '../pages/TimelinePage';
import { FlowPage } from '../pages/FlowPage';
import { DataStatusPage } from '../pages/DataStatusPage';
import { ReportsPage } from '../pages/ReportsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/overview" replace />,
      },
      {
        path: 'overview',
        element: <OverviewPage />,
      },
      {
        path: 'visualizations',
        element: <ChartPlaygroundPage />,
      },
      {
        path: 'visualizations/advanced',
        element: <AdvancedVisualizationPage />,
      },
      {
        path: 'maps',
        element: <InteractiveMapsPage />,
      },
      {
        path: 'maps/advanced',
        element: <AdvancedMapsPage />,
      },
      {
        path: 'data-explorer',
        element: <DataTablePage />,
      },
      {
        path: 'data-grid',
        element: <AdvancedDataGridPage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'timeline',
        element: <TimelinePage />,
      },
      {
        path: 'flow',
        element: <FlowPage />,
      },
      {
        path: 'data-status',
        element: <DataStatusPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'reports/:slug',
        element: <ReportsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/overview" replace />,
      },
    ],
  },
]);

export default router;
