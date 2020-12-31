import { Project } from './types';

const projects: Project[] = [
  {
    title: 'visx',
    subtitle:
      'visx is a collection of reusable low-level visualization components for React. visx combines the power of d3 to generate your visualization with the benefits of react for updating the DOM.',
    date: ['2017-01-01', 'current'],
    tags: ['data vis', 'web', 'library', 'open-source'],
    href: 'projects/visx',
    thumbnailUrl: '/static/images/visx/hero.png',
    employer: 'airbnb',
  },

  {
    title: 'Airbnb Org Chart',
    subtitle:
      'A visual product for exploring the Airbnb company, both team hierarchies and their functional composition.',
    date: ['2019-09-01', '2020-03-01'],
    tags: ['color', 'data vis', 'web', 'tool'],
    href: 'projects/airbnb-org-chart',
    thumbnailUrl: 'static/images/org-chart/donut-circle-pack.png',
    employer: 'airbnb',
  },

  {
    title: 'SLA Tracker',
    subtitle: 'An advanced analytical tool to explore & understand data pipeline landing times.',
    date: ['2019-06-01', '2020-06-01'],
    tags: ['data vis', 'web', 'tool'],
    href: 'projects/sla-tracker',
    thumbnailUrl: 'static/images/sla-tracker/lineage-thumbnail.png',
    employer: 'airbnb',
  },

  {
    title: 'Metric Explorer',
    subtitle:
      'Intuitive business analytics product that enables non-technical users to explore curated, high-quality metrics easily.',
    date: ['2017-06-01', '2019-01-01'],
    tags: ['data vis', 'web', 'tool'],
    href: 'projects/metric-explorer',
    thumbnailUrl: 'static/images/metric-explorer/metric-collection.png',
    employer: 'airbnb',
  },

  {
    title: 'Data Visualization Colors',
    subtitle: 'First Airbnb color palette designed specifically for data visualization.',
    date: ['2019-06-01', '2019-09-01'],
    tags: ['data vis', 'color'],
    roles: ['design'],
    href: 'projects/airbnb-color-palette',
    thumbnailUrl: 'static/images/color-palette/categorical-palette.png',
    employer: 'airbnb',
  },

  {
    title: 'Geo Explorer',
    subtitle:
      'Product to facilitate improve reliability, coverage, and precision of Airbnb geo definitions worldwide.',
    date: ['2018-03-01', '2018-06-01'],
    tags: ['data vis', 'color', 'maps', 'tool', 'web'],
    roles: ['engineering', 'design', 'visualization', 'product'],
    href: 'projects/geo-explorer',
    thumbnailUrl: 'static/images/geo-explorer/geo-explorer.png',
    employer: 'airbnb',
  },

  {
    title: 'Superset Dashboard 2.0',
    subtitle:
      'Re-imagined dashboarding experience with drag-and-drop, grid, and new components to support effective information hierarchy.',
    date: ['2018-01-01', '2019-01-01'],
    tags: ['tool', 'web', 'open-source'],
    href: 'projects/superset-dashboard',
    thumbnailUrl: 'static/images/superset-dashboard-v2/thumbnail.png',
    externalUrls: [
      {
        url: 'https://gist.github.com/williaster/bad4ac9c6a71b234cf9fc8ee629844e5',
        label: 'Detailed release notes',
      },
    ],
    employer: 'airbnb',
  },

  {
    title: '10 years of Airbnb Pin Map',
    subtitle: 'An interactive physical visualization presenting 10 years of Airbnb growth.',
    tags: ['physical', 'maps', 'color', 'data vis'],
    thumbnailUrl: 'static/images/pin-map/pin-map-1.png',
    employer: 'airbnb',
  },

  {
    title: 'Polka dot bike design',
    subtitle: 'Custom personal road bike paint job design',
    tags: ['color', 'physical', 'personal-project'],
    thumbnailUrl: 'static/images/bike/figma.png',
  },

  {
    title: 'Fraud Trace',
    subtitle:
      'Interface for understanding relationships between Airbnb guests & hosts, to support bad actor identification.',
    tags: ['data vis', 'web', 'tool'],
    thumbnailUrl: 'static/images/fraudtrace/thumbnail.png',
    employer: 'airbnb',
  },

  {
    title: 'Dataportal',
    subtitle: 'A tool to democratize data assets through search and metadata exploration.',
    tags: ['web', 'tool'],
    thumbnailUrl: 'static/images/dataportal/search-input.gif',
    employer: 'airbnb',
  },

  {
    title: 'Event Flow',
    subtitle: 'Advanced visualization for event sequence analysis.',
    tags: ['web', 'data vis'],
    thumbnailUrl: 'static/images/data-ui/event-flow.gif',
    employer: 'airbnb',
  },

  {
    title: 'data-ui',
    subtitle: 'Chart-level visualization components for building data-rich interfaces in React.',
    tags: ['data vis', 'web', 'library', 'open-source'],
    thumbnailUrl: 'static/images/data-ui/data-ui-sparkline.gif',
    employer: 'airbnb',
  },

  {
    title: 'Search Session Explorer',
    subtitle: 'Custom analytics visualization to understand single-user search sessions.',
    tags: ['data vis', 'web', 'tool'],
    thumbnailUrl: 'static/images/search-session-explorer/search-session-explorer.png',
    employer: 'airbnb',
  },
];

export default projects;
