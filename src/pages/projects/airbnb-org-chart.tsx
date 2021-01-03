import React from 'react';

import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const orgChartProject = projects.filter(p => p.href === 'projects/airbnb-org-chart')[0];

function OrgChart() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – Airbnb org chart"
        heroUrl="/static/images/org-chart/prototype-icicle.png"
        project={orgChartProject}
      >
        <div className="org-chart">{orgChartProject.subtitle}</div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default OrgChart;
