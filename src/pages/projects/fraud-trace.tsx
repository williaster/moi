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
          <p>{fraudtraceProject.subtitle}</p>
          <ProjectImage src="/static/images/fraud-trace/fraudtrace.gif" />
        </div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default FraudTrace;
