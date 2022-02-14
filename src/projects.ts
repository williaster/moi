import { Project } from './types';

const projects: Project[] = [
  {
    title: 'Fry universe',
    subtitle:
      '3D modeling and data vis were used to explore why you prefer some fry shapes to others.',
    tags: ['personal', '3D', 'data vis'],
    thumbnailUrl: '/static/images/fry-universe/site-preview.png',
    href: 'projects/fry-universe',
    dates: ['2021-12-01'],
  },

  {
    title: 'visx',
    subtitle:
      'visx is a collection of reusable low-level visualization components for React. visx combines the power of d3 to generate your visualization with the benefits of react for updating the DOM.',
    dates: ['2017', 'current'],
    tags: ['data vis', 'web', 'library', 'open-source'],
    href: 'projects/visx',
    thumbnailUrl: '/static/images/visx/hero.png',
    employer: 'Airbnb',
  },

  {
    title: 'Airbnb org chart',
    subtitle:
      'A visual product for exploring the Airbnb company, both team hierarchies and their functional composition.',
    dates: ['2019-09-01', '2020-03-01'],
    tags: ['data vis', 'web', 'tool'],
    href: 'projects/airbnb-org-chart',
    thumbnailUrl: '/static/images/org-chart/donut-circle-pack.png',
    employer: 'Airbnb',
  },

  {
    title: 'SLA tracker',
    subtitle: 'An advanced analytical tool to explore & understand data pipeline landing times.',
    dates: ['2019-06-01', '2020-06-01'],
    tags: ['data vis', 'web', 'tool'],
    href: 'projects/sla-tracker',
    thumbnailUrl: '/static/images/sla-tracker/lineage-thumbnail.png',
    employer: 'Airbnb',
  },

  {
    title: 'Metric explorer',
    subtitle:
      'Intuitive business analytics product that enables non-technical users to explore curated, high-quality metrics easily.',
    dates: ['2017-06-01', '2019-01-01'],
    tags: ['data vis', 'web', 'tool'],
    href: 'projects/metric-explorer',
    thumbnailUrl: '/static/images/metric-explorer/metric-collection.png',
    employer: 'Airbnb',
  },

  {
    title: 'Airbnb visualization colors',
    subtitle: 'The first Airbnb color palette designed specifically for data visualization.',
    dates: ['2019-06-01', '2019-09-01'],
    tags: ['data vis'],
    roles: ['design'],
    href: 'projects/airbnb-color-palette',
    thumbnailUrl: '/static/images/airbnb-color-palette/categorical-palette.png',
    employer: 'Airbnb',
  },

  {
    title: 'Geo explorer',
    subtitle:
      'Product to facilitate improve reliability, coverage, and precision of Airbnb geo definitions worldwide.',
    dates: ['2018-03-01', '2018-06-01'],
    tags: ['data vis', 'maps', 'tool', 'web'],
    roles: ['engineering', 'design', 'visualization', 'product'],
    href: 'projects/geo-explorer',
    thumbnailUrl: '/static/images/geo-explorer/geo-explorer.png',
    employer: 'Airbnb',
  },

  {
    title: 'Superset dashboard 2.0',
    subtitle:
      'Re-imagined dashboarding experience with drag-and-drop, grid, and new components to support effective information hierarchy.',
    dates: ['2018', '2019'],
    tags: ['tool', 'web', 'open-source'],
    href: 'projects/superset-dashboard',
    thumbnailUrl: '/static/images/superset-dashboard-v2/thumbnail.png',
    employer: 'Airbnb',
  },

  {
    title: '10 years of Airbnb pin map',
    subtitle: 'An interactive physical visualization presenting 10 years of Airbnb growth.',
    tags: ['maps', 'data vis'],
    thumbnailUrl: '/static/images/pin-map/pins-far.png',
    employer: 'Airbnb',
    href: 'projects/pin-map',
  },

  {
    title: 'Spatial gene expression',
    subtitle:
      'I developed a novel genome sequencing methodology to understand spatial (3D) gene expression.',
    tags: ['biology', 'data vis'],
    href: 'projects/ucsf',
    thumbnailUrl: '/static/images/ucsf/thumbnail.png',
    employer: 'UCSF',
    dates: ['2006-08-01', '2010-08-01'],
  },

  {
    title: 'Polka dot bike design',
    subtitle: 'Custom personal road bike paint job design',
    tags: ['personal'],
    thumbnailUrl: '/static/images/bike/figma.png',
    href: 'projects/bike',
    dates: ['2018'],
  },

  {
    title: 'Fraud trace',
    subtitle:
      'An advanced analytics tool for understanding relationships between Airbnb guests & hosts, to support bad actor identification.',
    tags: ['data vis', 'web', 'tool'],
    thumbnailUrl: '/static/images/fraud-trace/thumbnail.png',
    employer: 'Airbnb',
    href: 'projects/fraud-trace',
  },

  {
    title: 'Dataportal',
    subtitle: 'A tool to democratize data assets through search and metadata exploration.',
    dates: ['2015', 'current'],
    tags: ['web', 'tool'],
    thumbnailUrl: '/static/images/dataportal/search-input.gif',
    employer: 'Airbnb',
    href: 'projects/dataportal',
  },

  {
    title: 'Event flow',
    subtitle: 'Advanced visualization for event sequence analysis.',
    tags: ['web', 'data vis'],
    thumbnailUrl: '/static/images/data-ui/event-flow.gif',
    employer: 'Airbnb',
    href: 'projects/event-flow',
  },

  {
    title: 'data-ui',
    subtitle:
      'Chart-level visualization components for building data-rich interfaces in React. Built on visx.',
    tags: ['data vis', 'web', 'library', 'open-source'],
    thumbnailUrl: '/static/images/data-ui/data-ui-sparkline.gif',
    employer: 'Airbnb',
    href: 'projects/data-ui',
  },

  {
    title: '100 days of drawing',
    subtitle: 'A mission to progress my ability to draw and sketch.',
    dates: ['2020-09-13', '2020-12-23'],
    tags: ['drawing', 'personal'],
    thumbnailUrl: '/static/images/100-days-of-drawing/collage.jpg',
    employer: 'Personal',
    href: 'projects/100-days-of-drawing',
  },

  {
    title: 'Search session explorer',
    subtitle: 'Custom analytics visualization to understand single-user search sessions.',
    tags: ['data vis', 'web', 'tool'],
    thumbnailUrl: '/static/images/search-session-explorer/search-session-explorer.png',
    employer: 'Airbnb',
    href: 'projects/search-session-explorer',
  },
];

export default projects;
