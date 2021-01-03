import React from 'react';

import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const slaTrackerProject = projects.filter(p => p.href === 'projects/sla-tracker')[0];

function SLATracker() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – SLA tracker"
        heroUrl="/static/images/sla-tracker/lineage-thumbnail.png"
        project={slaTrackerProject}
      >
        <div className="sla-tracker">{slaTrackerProject.subtitle}</div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default SLATracker;
