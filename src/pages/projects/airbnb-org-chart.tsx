import React from 'react';

import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const orgChartProject = projects.filter(p => p.title.toLowerCase().includes('org chart'))[0];

function OrgChart() {
  return (
    <>
      <ProjectPage
        title="chris williams – Airbnb Org Chart"
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
