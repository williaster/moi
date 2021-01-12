import React from 'react';
// @ts-ignore
import GithubButton from 'react-github-button';
import 'react-github-button/assets/style.css';
import FlexContainer from '../../components/FlexContainer';
import ProjectImage from '../../components/ProjectImage';
import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const dataUiProject = projects.filter(p => p.href === 'projects/data-ui')[0];
const imageStyles = { width: '50%' };

function DataUiProject() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – data-ui"
        heroUrl="/static/images/data-ui/hero.png"
        project={dataUiProject}
      >
        <div className="data-ui">
          <p>{dataUiProject.subtitle}</p>
          <FlexContainer wrap alignItems="center">
            view&nbsp;<code>data-ui</code>&nbsp;on&nbsp;
            <a target="_blank" href="https://github.com/williaster/data-ui">
              Github
            </a>
            &nbsp;&nbsp;
            <GithubButton type="stargazers" namespace="williaster" repo="data-ui" />.
          </FlexContainer>
          <br />
          <h3>data-ui @ Airbnb</h3>

          <ProjectImage src="/static/images/data-ui/overview.png" />
          <p>
            Read more about how&nbsp;<code>data-ui</code>&nbsp;fit in @Airbnb in my 2018&nbsp;
            <a target="_blank" href="https://pasteapp.com/p/MszqF8XXBP9/s/dk0yc70o">
              SF React.js meetup slide deck
            </a>
          </p>

          <h3>Sparkline package</h3>
          <ProjectImage
            src="/static/images/data-ui/data-ui-sparkline.gif"
            imageStyles={imageStyles}
          />

          <h3>Network package</h3>
          <ProjectImage src="/static/images/data-ui/data-ui-network.gif" />

          <h3>Histogram package</h3>
          <ProjectImage
            src="/static/images/data-ui/data-ui-histogram.gif"
            imageStyles={imageStyles}
          />
        </div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default DataUiProject;
