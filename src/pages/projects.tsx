import React, { useState } from 'react';
import Link from 'next/link';
import cx from 'classnames';
import Page from '../components/Page';
import { Project, ProjectTag } from '../types';
import { blues, boxShadow, colors, linearGradient } from '../theme';
import projects from '../projects';
import BackgroundCircle from '../components/BackgroundCircle';

const MAX_WIDTH = 740;
const allTags = Array.from(
  new Set(projects.reduce((all, project) => all.concat(project.tags), [])),
).sort();

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
          max-width: ${MAX_WIDTH}px;
          min-height: 300px;
          background: white;
          border-radius: 4px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: row;
          box-shadow: ${boxShadow};
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
          margin: 8px 8px 0 0;
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
  const [tagFilter, setTagFilter] = useState<ProjectTag | null>(null);
  const filteredProjects =
    tagFilter == null
      ? projects
      : projects.filter(project => project.tags.some(tag => tagFilter === tag));
  return (
    <Page>
      <BackgroundCircle color={`${blues[0]}15`} />
      <BackgroundCircle position="bottom" color={`${colors[colors.length - 1]}15`} />
      <div className="projects">
        <h2>Projects</h2>
        <p>
          Below is collection of selected projects. Try filtering by project tag, click a project to
          learn more.
        </p>
        <br />
        <div className="tags">
          <span className="label">Tags</span>
          &nbsp;&nbsp;
          {allTags.map(tag => (
            <div
              key={tag}
              role="button"
              onClick={() => {
                setTagFilter(tag === tagFilter ? null : tag);
              }}
              className={cx('tag', tag === tagFilter && 'tag--selected')}
            >
              {tag}
            </div>
          ))}
        </div>

        {tagFilter && (
          <div className="label">{`Filtered to ${filteredProjects.length} of ${projects.length} projects`}</div>
        )}

        {filteredProjects.map(project => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
      <style jsx>{`
        .projects {
          position: relative;
          z-index: 1;
          height: 100%;
          max-width: ${MAX_WIDTH}px;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
        }
        .label {
          font-size: 0.8em;
          font-weight: 200;
        }
        .tags {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: baseline;
          margin-bottom: 2em;
        }
        .tag {
          font-size: 0.6rem;
          font-weight: 300;
          line-height: 0.6rem;
          margin: 8px 8px 0 0;
          border: 1px solid currentcolor;
          padding: 2px 8px;
          border-radius: 2px;
          cursor: pointer;
        }
        .tag:hover,
        .tag--selected {
          color: #fff;
          background: ${linearGradient};
        }
      `}</style>
    </Page>
  );
}

export default ProjectsPage;
