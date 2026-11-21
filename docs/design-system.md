# EduAtlas Design System v1.0

**Tagline:** Explore Education Through Data.

## 1. Brand Identity

- **Product:** EduAtlas
- **Category:** Education Analytics Dashboard
- **Brand personality:** Modern, trustworthy, educational, data-driven, approachable.
- **Logo concept:** Map pin + graduation cap.
- **Primary use cases:** Education data analytics, charts, interactive maps, institutional data, academic calendars, reports, and exports.

## 2. Color Palette

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| Atlas Navy | `#153B66` | Primary brand, headings, navigation |
| Knowledge Teal | `#25A9A1` | Primary accent, active states, actions |
| Sky Cyan | `#8ED8E4` | Supporting charts, highlights |
| Discovery Gold | `#FFC857` | Secondary highlights, chart series |

### Neutral Colors

| Token | Hex | Usage |
|---|---|---|
| Background | `#F5F8FC` | Application background |
| Surface | `#FFFFFF` | Cards, panels, dialogs |
| Foreground | `#172B4D` | Primary text |
| Muted | `#526579` | Secondary text |
| Border | `#DCE5EF` | Borders, dividers |

### Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| Success | `#16835D` | Success, healthy, completed |
| Warning | `#B7791F` | Warnings, delayed data |
| Error | `#C2414B` | Errors, unavailable services |
| Info | `#2563A6` | Informational messages |

Use consistent colors for the same data categories across every page. Never rely on color alone to communicate status.

## 3. Typography

- **Headings and brand:** Plus Jakarta Sans
- **Body and UI:** Inter
- **Numeric data:** Use tabular numerals where possible.

| Token | Size | Usage |
|---|---|---|
| Display | 32–36 px | Major dashboard title |
| H1 | 28–32 px | Page title |
| H2 | 20–24 px | Section title |
| H3 | 16–18 px | Card title |
| Body | 14 px | Main content |
| Small | 12 px | Metadata and labels |
| Caption | 11 px | Supporting information |

Use consistent font weights: 400 for body text, 500 for controls, 600 for headings, and 700 for major metrics.

## 4. Layout and Spacing

### Spacing Scale

Use a 4 px base scale:

`4, 8, 12, 16, 24, 32, 48, 64 px`

### Layout Specifications

- Desktop sidebar: 180–200 px.
- Sidebar-to-content gap: 20–24 px.
- Page padding: 16–24 px.
- Card padding: 16–20 px.
- Card radius: 12–16 px.
- Input and button radius: 8–12 px.
- Standard card gap: 16 px.
- Main content should expand when the sidebar is collapsed.
- On smaller screens, the sidebar becomes a drawer.
- Avoid unnecessary bottom padding and excessive empty space.

### Application Shell

- Floating sidebar, visually separated from content.
- EduAtlas logo at the top of the sidebar.
- Navigation icons above their labels.
- Page title and global filters aligned in the main header.
- User avatar and display name in the top-right corner.
- No login or registration system in this application.
- Fixed Export Data button at the bottom-right, raised above the screen edge.
- Export actions must respect the active filters and snapshot.

## 5. Component Standards

### Buttons

- Primary: Atlas Navy background with white text.
- Accent action: Knowledge Teal background with white text.
- Secondary: White or transparent background with a subtle border.
- Destructive: Error color.
- Include hover, focus, active, disabled, and loading states.

### Form Controls

Standardize the appearance and behavior of:

- Input and search fields.
- Select and multi-select.
- Date and date-range picker.
- Checkbox and radio controls.
- Filter chips.
- Tabs and segmented controls.
- Dropdown menus.
- Dialogs and confirmation prompts.

### Status Badges

Use consistent variants for:

- Online / Healthy
- Degraded / Delayed
- Error / Down
- Completed
- In Progress
- Demo Data

Badges must include readable text and sufficient contrast.

### Cards

- White surface.
- Subtle border.
- Rounded corners.
- Consistent padding.
- Avoid excessive shadows and unnecessary decoration.

### KPI Cards

Every KPI card should support:

- Label.
- Main value.
- Unit where applicable.
- Comparison period.
- Trend indicator when valid.
- Optional icon or small sparkline.
- Loading, error, and unavailable states.

### Tables and Data Grids

- Consistent row height and typography.
- Sortable columns where relevant.
- Search and filtering.
- Pagination.
- Column visibility controls when useful.
- Row selection and bulk actions where appropriate.
- Empty, loading, and error states.
- Server-side filtering, sorting, and pagination for large datasets.
- Do not load an entire large dataset into the browser unnecessarily.

## 6. Visualization Standards

### Recommended Chart Types

| Chart | Purpose |
|---|---|
| Line | Trends over time |
| Bar / Column | Category comparisons |
| Stacked Bar | Composition across groups |
| Area | Trends and cumulative patterns |
| Pie / Donut | Simple proportional breakdowns |
| Scatter / Bubble | Relationships between variables |
| Radar | Comparing multiple indicators |
| Heatmap | Density and intensity |
| Treemap | Hierarchical proportions |
| Sankey | Flows between stages |
| Gauge | Progress toward a defined target |
| Choropleth | Geographic comparisons |
| Network Graph | Relationships between entities |
| Gantt | Activity schedules and dependencies |

Every chart should have a meaningful title, appropriate units, readable labels, and a legend or tooltip when needed.

Additional rules:

- Use the same category colors across all pages.
- Avoid excessive categories in pie charts.
- Use appropriate axes and scales.
- Format large numbers consistently.
- Show missing data as missing, not as zero.
- Do not imply causation from correlation.
- Provide an accessible alternative or data table for important charts.
- Include geographic attribution where required.

## 7. Data and Snapshot Standards

Every dataset-driven page must display relevant metadata:

- Snapshot timestamp.
- Reporting period.
- Data source.
- Geographic scope.
- Education level.
- Demo Data label when applicable.

### Data Rules

- All dashboard values must come from the EduAtlas API or a clearly defined demo dataset.
- Use consistent datasets across cards, charts, maps, tables, and exports.
- Do not mix incompatible reporting periods.
- Do not fabricate official statistics or claim illustrative values are official.
- Distinguish zero, null, unavailable, and not applicable values.
- Display the last successful update time.
- Show stale-data warnings when freshness requirements are not met.
- Ensure exports include relevant filters, period, and source metadata.

### Indonesian Formatting

- Locale: `id-ID`
- Example number: `125.482`
- Example decimal: `99,6%`
- Example date: `20 Okt 2026`
- Example timestamp: `20 Okt 2026, 10:24 WIB`

Use consistent formatting throughout the application.

## 8. Global Filters and Export

### Global Filters

Standard controls:

- Country or geographic scope.
- Reporting year.
- Education level.
- Date range.

When applicable, additional page-level filters can include province, city/regency, institution type, status, accreditation, and dataset.

Filters should have predictable behavior and clearly indicate active selections.

### Export Data

- Fixed at the bottom-right of the application.
- Use Knowledge Teal with a download icon.
- Supported formats depend on the data type: CSV, Excel, PDF, and optionally PowerPoint or iCalendar.
- Export only the intended filtered dataset.
- Show progress and completion or failure feedback.
- Use background jobs for large exports.
- Never claim an export succeeded until the operation completes.

## 9. Accessibility and Responsive Design

- Maintain sufficient text and component contrast.
- Use semantic headings and controls.
- Support keyboard navigation and visible focus indicators.
- Provide accessible names for icon-only buttons.
- Do not communicate status using color alone.
- Ensure charts have accessible summaries or table alternatives.
- Keep tables usable on smaller screens.
- Convert the sidebar into a drawer on narrow screens.
- Prevent content from overflowing horizontally where avoidable.
- Respect reduced-motion preferences.

## 10. Tailwind CSS v4 Design Tokens

Add the following to the global stylesheet:

```css
@import "tailwindcss";

@theme {
  --color-atlas-navy: #153B66;
  --color-knowledge-teal: #25A9A1;
  --color-sky-cyan: #8ED8E4;
  --color-discovery-gold: #FFC857;

  --color-background: #F5F8FC;
  --color-surface: #FFFFFF;
  --color-foreground: #172B4D;
  --color-muted: #526579;
  --color-border: #DCE5EF;

  --color-success: #16835D;
  --color-warning: #B7791F;
  --color-error: #C2414B;
  --color-info: #2563A6;

  --font-heading: "Plus Jakarta Sans", sans-serif;
  --font-body: "Inter", sans-serif;

  --radius-card: 1rem;
  --radius-control: 0.625rem;
}
```

Load Plus Jakarta Sans and Inter through the application's approved font-loading strategy.

## 11. Recommended Shared Component Structure

```text
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   └── tabs.tsx
│   ├── layout/
│   │   ├── app-shell.tsx
│   │   ├── sidebar.tsx
│   │   ├── page-header.tsx
│   │   └── export-button.tsx
│   ├── common/
│   │   ├── global-filters.tsx
│   │   ├── snapshot-banner.tsx
│   │   ├── kpi-card.tsx
│   │   └── data-table.tsx
│   ├── charts/
│   ├── maps/
│   └── tables/
├── features/
│   ├── overview/
│   ├── visualizations/
│   ├── education-atlas/
│   ├── data-explorer/
│   ├── academic-calendar/
│   └── reports/
├── lib/
│   ├── api.ts
│   ├── formatters.ts
│   └── query-client.ts
└── styles/
    ├── tokens.css
    └── components.css
```

Adapt the structure to the existing repository rather than duplicating components or replacing working architecture unnecessarily.

## 12. The 12 Main Pages

1. Overview Dashboard
2. Chart Playground
3. Advanced Visualization
4. Interactive Maps
5. Advanced Maps
6. Data Table / Data Explorer
7. Advanced Data Grid
8. Calendar & Scheduling
9. Timeline & Gantt
10. Flow & Network
11. API & Data Status
12. Reports & Export

All pages must share the same design tokens, application shell, typography, filters, status indicators, and export behavior.

## 13. Definition of Done

- [ ] Design tokens are centralized.
- [ ] Shared components are reused across all pages.
- [ ] Sidebar and header follow the standard layout.
- [ ] Responsive behavior is implemented.
- [ ] Loading, error, empty, and success states exist.
- [ ] Data formatting is consistent in Indonesian locale.
- [ ] Snapshot metadata is visible where relevant.
- [ ] Demo data is explicitly labeled.
- [ ] Charts, tables, maps, and exports use consistent data.
- [ ] Accessibility and keyboard navigation are tested.
- [ ] No unnecessary login or registration flow is introduced.
- [ ] Tests and build are executed and their results verified.
