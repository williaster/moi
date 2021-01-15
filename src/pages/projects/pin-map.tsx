import React from 'react';
import ProjectImage from '../../components/ProjectImage';
import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const pinProject = projects.filter(p => p.href === 'projects/pin-map')[0];
const imageStyles = { marginBottom: 24 };

function PinProject() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – 10 years of Airbnb pin map"
        heroUrl="/static/images/pin-map/hero.png"
        project={pinProject}
      >
        <div className="pin-map">
          <p>
            A collaboration with the Environments team – our in-house architects – we designed a
            physical visualization representing Airbnb’s growth over 10 years. Each year was
            represented with a different pin color, and 80,000 pins were available to be added to
            the physical quilt map by employees.
          </p>

          <h3>Interpretation</h3>
          <p></p>
          <div className="flex">
            <ProjectImage src="/static/images/pin-map/pins-far.png" />
            &nbsp;
            <ProjectImage src="/static/images/pin-map/pins-legend.png" />
            &nbsp;
            <ProjectImage src="/static/images/pin-map/pins-close.png" />
          </div>

          <h3>Process and challenges</h3>

          <ProjectImage src="/static/images/pin-map/digital-years.gif" imageStyles={imageStyles} />
          <ProjectImage
            src="/static/images/pin-map/pin-map-digital.gif"
            imageStyles={imageStyles}
          />
          <ProjectImage
            src="/static/images/pin-map/quilt-dimensions.png"
            imageStyles={imageStyles}
          />
          <ProjectImage src="/static/images/pin-map/quilt-empty.jpg" imageStyles={imageStyles} />
          <ProjectImage src="/static/images/pin-map/quilt-tracing.jpg" imageStyles={imageStyles} />

          <ProjectImage src="/static/images/pin-map/pins.jpg" imageStyles={{ width: '80%' }} />
        </div>
      </ProjectPage>
      <style jsx>{`
        .flex {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
        }
        @media (max-width: 1000px) {
          .flex {
            flex-flow: row wrap;
          }
        }
      `}</style>
    </>
  );
}

export default PinProject;
