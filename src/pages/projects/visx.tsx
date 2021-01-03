import React from 'react';
// @ts-ignore
import GithubButton from 'react-github-button';
import 'react-github-button/assets/style.css';
import FlexContainer from '../../components/FlexContainer';
import ProjectImage from '../../components/ProjectImage';

import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const visxProject = projects.filter(p => p.title === 'visx')[0];

function Visx() {
  return (
    <>
      <ProjectPage
        title="chris williams – visx"
        heroUrl="/static/images/visx/hero-dark.png"
        heroStyles={{ backgroundColor: '#000' }}
        project={visxProject}
      >
        <div className="visx">
          <p>
            At Airbnb, we made it a goal to unify our visualization stack across the company, and in
            the process we created a collection of novel visualization primitives for{' '}
            <code>React</code>, filling a major gap in available frontend visualization tooling.
          </p>
          <div className="links">
            <FlexContainer alignItems="center">
              Check it out on Github&nbsp;&nbsp;
              <GithubButton type="stargazers" namespace="airbnb" repo="visx" />
            </FlexContainer>
            <FlexContainer alignItems="center">
              Read the full blog post&nbsp;&nbsp;
              <a
                rel="nofollow noopener noreferrer"
                target="_blank"
                href="https://medium.com/airbnb-engineering/introducing-visx-from-airbnb-fd6155ac4658"
              >
                on Medium
              </a>
            </FlexContainer>
          </div>

          <ProjectImage src="/static/images/visx/gallery.png" />

          <p>
            <h3>What is visx?</h3>
            <code>visx</code> stands for visualization components, and is a suite of over 30
            separate packages of <code>React</code> visualization primitives that fall into several
            categories. It is un-opinionated on state management, animation, and styling so it can
            integrate with any <code>React</code> codebase, and its emphasis on modularity (similar
            to <code>D3</code>) lets you keep your bundle sizes down by only using the packages you
            need to create your reusable chart library or a custom one-off chart.
            <ProjectImage src="/static/images/visx/visx-packages.png" />
          </p>

          <p>
            <h3>What makes visx unique?</h3>
            Looking at the problem space below, there was clearly an opportunity for a highly
            expressive <code>React</code> library to thrive. By creating low-level visualization
            primitives with a first-class <code>React</code> API, we hoped we could deliver
            learnability, expressiveness, and performance that any frontend developer could pick up.
            <ProjectImage src="/static/images/visx/visx-overview.png" />
          </p>

          <p>
            <h3>Want to read more?</h3>
            <p>
              Read the full blog post&nbsp;&nbsp;
              <a
                rel="nofollow noopener noreferrer"
                target="_blank"
                href="https://medium.com/airbnb-engineering/introducing-visx-from-airbnb-fd6155ac4658"
              >
                on Medium
              </a>
            </p>
          </p>
        </div>
      </ProjectPage>
      <style jsx>{`
        .visx li {
          list-style-type: disc;
        }
        .links {
          margin: 1em 0;
        }
      `}</style>
    </>
  );
}

export default Visx;
