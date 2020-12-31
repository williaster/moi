import React from 'react';
import { Project } from '../types';
import DateRange from './DateRange';
import Page from './Page';
import ProjectTag from './ProjectTag';

function ProjectPage({
  children,
  imageStyles,
  title,
  className,
  project,
}: {
  children: React.ReactNode;
  imageStyles: React.CSSProperties;
  title?: string;
  className?: string;
  project: Project;
}) {
  return (
    <>
      <Page title={title} className={className}>
        <div className="img" style={imageStyles} />

        <div className="content">
          <h1>{project.title}</h1>
          {project.dates && <DateRange start={project.dates[0]} end={project.dates[1]} />}
          {project.tags && (
            <div className="tags">
              {project.tags.map(tag => (
                <ProjectTag key={tag} tag={tag} />
              ))}
            </div>
          )}
          {children}
        </div>
      </Page>
      <style jsx>{`
        .img {
          min-height: 400px;
          width: 100vw;
          background-size: auto;
          background-position: center;
          background-repeat: no-repeat;
        }
        .content {
          max-width: 800px;
        }
        .tags {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: baseline;
          margin-bottom: 2em;
        }
      `}</style>
    </>
  );
}

export default ProjectPage;
