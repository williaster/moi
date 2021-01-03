import React from 'react';
import ProjectImage from '../../components/ProjectImage';

import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const geoExplorerProject = projects.filter(p => p.href === 'projects/geo-explorer')[0];

function GeoExplorer() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – SLA tracker"
        heroUrl="/static/images/geo-explorer/geo-explorer-light.png"
        project={geoExplorerProject}
      >
        <div className="geo-explorer">
          <p>{geoExplorerProject.subtitle}</p>
          <ProjectImage src="/static/images/geo-explorer/geo-explorer.gif" />
        </div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default GeoExplorer;
