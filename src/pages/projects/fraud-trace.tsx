import React from 'react';
import ProjectImage from '../../components/ProjectImage';
import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const fraudtraceProject = projects.filter(p => p.href === 'projects/fraud-trace')[0];

function FraudTrace() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – Fraud trace"
        heroUrl="/static/images/fraud-trace/fraudtrace.png"
        project={fraudtraceProject}
      >
        <div className="fraud-trace">
          <p>
            This was a collaboration with the Airbnb Trust & Safety organization. We designed and
            built a tool which enabled exploration of how Airbnb users are connected to help fight
            fraud.
          </p>
          <ProjectImage src="/static/images/fraud-trace/fraudtrace.gif" />
        </div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default FraudTrace;
