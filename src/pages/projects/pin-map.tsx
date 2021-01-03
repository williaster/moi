import React from 'react';
import ProjectImage from '../../components/ProjectImage';
import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const pinProject = projects.filter(p => p.href === 'projects/pin-map')[0];

function PinProject() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – 10 years of Airbnb pin map"
        heroUrl="/static/images/pin-map/pin-map-1.png"
        project={pinProject}
      >
        <div className="pin-map">
          <p>{pinProject.subtitle}</p>
          <ProjectImage src="/static/images/pin-map/pin-map-1.png" />
          <ProjectImage src="/static/images/pin-map/pin-map-2.png" />
          <ProjectImage src="/static/images/pin-map/pin-map-digital.gif" />
        </div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default PinProject;
