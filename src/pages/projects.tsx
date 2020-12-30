import React from 'react';
import Link from 'next/link';
import Page from '../components/Page';
import { Project } from '../types';

const projects: Project[] = [
  {
    title: 'visx',
    subtitle:
      'visx is a collection of reusable low-level visualization components for React. visx combines the power of d3 to generate your visualization with the benefits of react for updating the DOM.',
    date: ['2017-01-01', 'current'],
    tags: ['design', 'visualization', 'web', 'library'],
    roles: ['engineering', 'design', 'visualization'],
    href: 'projects/visx',
    thumbnailUrl: '/static/images/visx/hero.png',
  },

  {
    title: 'Airbnb Org Chart',
    subtitle:
      'A visual product for exploring the Airbnb company, both team hierarchies and their functional composition.',
    date: ['2019-09-01', '2020-03-01'],
    tags: ['color', 'design', 'visualization', 'web', 'tool'],
    roles: ['design', 'visualization', 'product', 'prototyping'],
    href: 'projects/airbnb-org-chart',
    thumbnailUrl: 'static/images/org-chart/donut-circle-pack.png',
  },

  {
    title: 'SLA Tracker',
    subtitle:
      'An advanced visualization UI that surfaces typical critical paths of data pipelines based on pipeline lineage.',
    date: ['2019-06-01', '2020-06-01'],
    tags: ['design', 'visualization', 'web', 'tool'],
    roles: ['engineering', 'design', 'visualization', 'product', 'prototyping'],
    href: 'projects/sla-tracker',
    thumbnailUrl: 'static/images/sla-tracker/lineage-thumbnail.png',
  },

  {
    title: 'Metric Explorer',
    subtitle:
      'Intuitive business analytics product that enables non-technical users to explore curated, high-quality metrics easily.',
    date: ['2017-06-01', '2019-01-01'],
    tags: ['design', 'visualization', 'web', 'tool'],
    roles: ['engineering', 'design', 'visualization', 'product'],
    href: 'projects/metric-explorer',
    thumbnailUrl: 'static/images/metric-explorer/metric-collection.png',
  },

  {
    title: 'Data Visualization Colors',
    subtitle: 'First Airbnb color palette designed specifically for data visualization.',
    date: ['2019-06-01', '2019-09-01'],
    tags: ['design', 'visualization', 'color'],
    roles: ['design'],
    href: 'projects/airbnb-color-palette',
  },

  {
    title: 'Geo Explorer',
    subtitle:
      'Product to facilitate improve reliability, coverage, and precision of Airbnb geo definitions worldwide.',
    date: ['2018-03-01', '2018-06-01'],
    tags: ['design', 'visualization', 'color', 'map', 'tool', 'web'],
    roles: ['engineering', 'design', 'visualization', 'product'],
    href: 'projects/geo-explorer',
  },

  {
    title: 'Superset Dashboard 2.0',
    subtitle:
      'Re-imagined dashboarding experience with drag-and-drop, and new components to effective information hierarchy for reporting.',
    date: ['2018-01-01', '2019-01-01'],
    tags: ['design', 'tool', 'web'],
    roles: ['engineering', 'design', 'product'],
    href: 'projects/superset-dashboard',
  },

  {
    title: '10 years of Airbnb Pin Map',
  },

  {
    title: 'Custom bike design',
  },

  {
    title: 'Fraud Trace 2.0',
  },

  {
    title: 'Dataportal',
  },

  {
    title: 'Event Flow',
  },

  {
    title: 'data-ui',
  },

  {
    title: 'Search Session Explorer',
  },
];

function ProjectCard(project: Project) {
  return (
    <div>
      <Link href={project.href || ''}>
        <div className="card">
          <div className="content">
            <h2>{project.title}</h2>
            {project.subtitle && <p className="subtitle">{project.subtitle}</p>}
            <div className="tags">
              {project.tags?.map(tag => (
                <div className="tag" key={tag}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div
            className="img"
            style={{
              backgroundImage: `url(${project.thumbnailUrl})`,
            }}
          />
        </div>
      </Link>
      <style jsx>{`
        .card {
          max-width: 740px;
          min-height: 300px;
          background: white;
          border-radius: 4px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: row;
          box-shadow: 0 10px 40px -10px rgba(0, 64, 128, 0.2);
          cursor: pointer;
        }
        .content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .img {
          width: 300px;
          min-height: 200px;
          flex-shrink: 0;
          border-radius: inherit;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .subtitle {
          margin-top: -1.75em;
          margin-bottom: 1.75em;
          font-size: 0.8rem;
        }
        .tags {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }
        .tag {
          font-size: 0.6rem;
          font-weight: 300;
          line-height: 1em;
          margin-right: 8px;
          border: 1px solid currentcolor;
          padding: 2px 8px;
          border-radius: 2px;
        }
        @media (max-width: 600px) {
          .card {
            flex-direction: column-reverse;
          }
          .img {
            width: 100%;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}

function ProjectsPage() {
  return (
    <Page>
      <div className="projects">
        <h2>Projects</h2>
        <p>Below is collection of selected projects. Try filtering by project type or time.</p>
        <br />
        {projects.map(project => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
      <style>{`
        .projects {
          height: 100%;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
        }
      `}</style>
    </Page>
  );
}

export default ProjectsPage;
