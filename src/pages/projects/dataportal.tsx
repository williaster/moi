import React from 'react';
import ProjectImage from '../../components/ProjectImage';
import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const dataportalProject = projects.filter(p => p.href === 'projects/dataportal')[0];

function Dataportal() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – Dataportal"
        heroUrl="/static/images/dataportal/search-input.gif"
        project={dataportalProject}
      >
        <div className="dataportal">
          <p>{dataportalProject.subtitle}</p>
          <p>
            Read more in the{' '}
            <a
              target="_blank"
              href="https://medium.com/airbnb-engineering/democratizing-data-at-airbnb-852d76c51770"
            >
              Medium blog post
            </a>
            .
          </p>
          <h3>Search</h3>
          <ProjectImage src="/static/images/dataportal/search.png" />
          <h3>Data assets</h3>
          <ProjectImage src="/static/images/dataportal/entity.png" />
          <h3>Employees</h3>
          <ProjectImage src="/static/images/dataportal/user.png" />
        </div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default Dataportal;
