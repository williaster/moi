import React from 'react';
import ProjectImage from '../../components/ProjectImage';
import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const searchProject = projects.filter(p => p.href === 'projects/search-session-explorer')[0];

function SearchExplorer() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – Search session explorer"
        heroUrl="/static/images/search-session-explorer/hero.png"
        project={searchProject}
      >
        <div className="search-explorer">
          <p>{searchProject.subtitle}</p>
          <ProjectImage src="/static/images/search-session-explorer/search-session-explorer.gif" />
          <h3>Interpretation</h3>
          <ProjectImage src="/static/images/search-session-explorer/search-session-sketch.png" />
        </div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default SearchExplorer;
