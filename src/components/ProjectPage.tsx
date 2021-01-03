import React from 'react';
import { Project } from '../types';
import getStaticUrl from '../utils/getStaticUrl';
import DateRange from './DateRange';
import FlexContainer from './FlexContainer';
import Page from './Page';
import ProjectTag from './ProjectTag';

function ProjectPage({
  children,
  heroStyles,
  heroUrl,
  title,
  className,
  project,
}: {
  children: React.ReactNode;
  heroUrl?: string;
  heroStyles?: React.CSSProperties;
  title?: string;
  className?: string;
  project: Project;
}) {
  return (
    <>
      <Page title={title} className={className}>
        {(heroUrl || heroStyles) && (
          <div
            className="hero"
            style={{ backgroundImage: `url(${getStaticUrl(heroUrl)})`, ...heroStyles }}
          />
        )}
        <div className="content">
          <h1>{project.title}</h1>
          {(project.dates || project.employer) && (
            <FlexContainer alignItems="center">
              {project.employer && (
                <>
                  <strong>@{project.employer}</strong>&nbsp;&nbsp;
                </>
              )}
              {project.dates && <DateRange start={project.dates[0]} end={project.dates[1]} />}
            </FlexContainer>
          )}

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
        .hero {
          min-height: 400px;
          width: 100vw;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .content {
          max-width: 800px;
        }
        .content > h1 {
          margin-bottom: 0;
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
