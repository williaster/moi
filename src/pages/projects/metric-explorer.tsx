import React from 'react';

import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const metricExplorerProject = projects.filter(p => p.href === 'projects/metric-explorer')[0];

function MetricExplorer() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – Metric explorer"
        heroUrl="/static/images/metric-explorer/metric-collection.png"
        project={metricExplorerProject}
      >
        <div className="metric-explorer">
          <h3>Overview</h3>
          <p>{metricExplorerProject.subtitle}</p>
          {/* <h3>The importance of micro-interactions</h3> */}
        </div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default MetricExplorer;
