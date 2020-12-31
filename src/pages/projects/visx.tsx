import React from 'react';
import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const visxProject = projects.filter(p => p.title === 'visx')[0];

function Visx() {
  return (
    <>
      <ProjectPage
        title="chris williams – visx"
        imageStyles={{
          backgroundColor: '#000',
          backgroundImage: `url('/static/images/visx/hero-dark.png')`,
        }}
        project={visxProject}
      >
        <div className="visx">
          <div>
            <p>
              At Airbnb, we made it a goal to unify our visualization stack across the company, and
              in the process we created a new project that brings together the power of D3 with the
              joy of React. Here are the advantages of visx:
            </p>
            <ul>
              <li>
                <strong>Keep bundle sizes down</strong> visx is split into multiple packages. Start
                small and use only what you need.
              </li>
              <li>
                <strong>Un-opinionated on purpose.</strong> Bring your own state management,
                animation library, or CSS-in-JS solution. Odds are good your React app already has
                an opinion on how animation, theming, or styling is done. visx is careful not to add
                another one and integrates with all of them.
              </li>
              <li>
                <strong>Not a charting library.</strong> As you start using visualization
                primitives, you’ll end up building your own charting library that’s optimized for
                your use case. You’re in control.
              </li>
            </ul>

            <p>
              And most importantly — it’s just React. If you know React, you can make
              visualizations. It’s all the same standard APIs and familiar patterns. visx should
              feel at home in any React codebase. We’re excited to see what you build with it!
            </p>
          </div>
        </div>
      </ProjectPage>
      <style jsx>{`
        .visx li {
          list-style-type: disc;
        }
      `}</style>
    </>
  );
}

export default Visx;
