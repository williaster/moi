import React, { useState } from 'react';
import Link from 'next/link';
import Page from '../components/Page';
import { Project, ProjectTag as ProjectTagType } from '../types';
import { blues, boxShadow, colors } from '../theme';
import projects from '../projects';
import BackgroundCircle from '../components/BackgroundCircle';
import ProjectTag from '../components/ProjectTag';
import DateRange from '../components/DateRange';
import getStaticUrl from '../utils/getStaticUrl';

const MAX_WIDTH = 740;
const allTags = Array.from(
  new Set(projects.reduce((all, project) => all.concat(project.tags), [])),
).sort();

function ProjectCard(project: Project) {
  return (
    <>
      <Link href={project.href || ''}>
        <div className="card">
          <div className="content">
            <h2 className="title"> {project.title}</h2>
            {project.dates && <DateRange start={project.dates[0]} end={project.dates[1]} />}
            {project.subtitle && <p className="subtitle">{project.subtitle}</p>}

            <div className="tags">
              {project.tags?.map(tag => (
                <ProjectTag key={tag} tag={tag} />
              ))}
            </div>
          </div>
          <div
            className="img"
            role="image"
            style={{
              backgroundImage: `url(${getStaticUrl(project.thumbnailUrl)})`,
            }}
          />
        </div>
      </Link>

      <style jsx>{`
        .title {
          margin-bottom: 0;
        }
        .card {
          max-width: ${MAX_WIDTH}px;
          background: white;
          border-radius: 4px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: row;
          flex-shrink: 0;
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
          min-height: 300px;
          flex-shrink: 0;
          border-radius: inherit;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .subtitle {
          margin-bottom: 1.75em;
          font-size: 0.8rem;
        }
        .tags {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }
        @media (max-width: 600px) {
          .card {
            flex-direction: column-reverse;
          }
          .title {
            margin-top: 0;
          }
          .img {
            width: 100%;
            margin: 0;
          }
        }
      `}</style>
    </>
  );
}

function ProjectsPage() {
  const [tagFilter, setTagFilter] = useState<ProjectTagType | null>(null);
  const filteredProjects =
    tagFilter == null
      ? projects
      : projects.filter(project => project.tags.some(tag => tagFilter === tag));
  return (
    <Page title="Chris Williams – projects">
      <BackgroundCircle color={`${blues[0]}15`} />
      <BackgroundCircle position="bottom" color={`${colors[colors.length - 1]}15`} />
      <div className="projects">
        <h2>Projects</h2>
        <p>
          Below is collection of selected projects. Try filtering by project tag, click a project to
          learn more.
        </p>
        <div className="tags">
          <span className="label">Tags</span>
          &nbsp;&nbsp;
          {allTags.map(tag => (
            <ProjectTag
              key={tag}
              tag={tag}
              filled={tag === tagFilter}
              onClick={() => {
                setTagFilter(tag === tagFilter ? null : tag);
              }}
            />
          ))}
        </div>

        {tagFilter && (
          <div className="label">{`Filtered to ${filteredProjects.length} of ${projects.length} projects`}</div>
        )}

        {filteredProjects.map(project => (
          <ProjectCard key={project.title} {...project} />
        ))}
        <br />
        <br />
        <br />
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
          flex-flow: row wrap;
          align-items: baseline;
          flex-shrink: 0;
          line-height: 1em;
          margin-bottom: 2em;
        }
      `}</style>
    </Page>
  );
}

export default ProjectsPage;
