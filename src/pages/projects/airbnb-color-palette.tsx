import React from 'react';
import ProjectImage from '../../components/ProjectImage';

import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const colorsProject = projects.filter(p => p.href === 'projects/airbnb-color-palette')[0];

function AirbnbVisColors() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – Airbnb visualization colors"
        heroUrl="/static/images/airbnb-color-palette/categorical-palette.png"
        project={colorsProject}
      >
        <div className="vis-colors">
          <p>{colorsProject.subtitle}</p>
          <h3>Categorical</h3>
          <ProjectImage src="/static/images/airbnb-color-palette/categorical-palette.png" />
          <h3>Sequential</h3>
          <ProjectImage src="/static/images/airbnb-color-palette/sequential-palette.png" />
          <h3>Diverging</h3>
          <ProjectImage src="/static/images/airbnb-color-palette/diverging-palette.png" />
        </div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default AirbnbVisColors;
