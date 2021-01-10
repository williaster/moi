import React from 'react';
import Emphasize from '../../components/Emphasize';
import ProjectImage from '../../components/ProjectImage';

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
        <div className="org-chart">
          <p>
            After working at Airbnb for four years you might expect that I could have articulated
            how the company was structured, but you would be wrong. Surprisingly, although we had a
            fantastic internal portal for looking up employees and the teams they were on,{' '}
            <Emphasize>
              we had no high-level visual overview of how the company was structured
            </Emphasize>
            .
          </p>
          <p>
            <Emphasize>
              Organizational structure is not only complicated, but changes to the structure are
              constant{' '}
            </Emphasize>
            . Every time a "re-org" happened, it was articulated solely with words – leaving me
            confused about what was going on and surprised that there were no visuals to depict the
            "before" and "after" organizational state.
          </p>
          <p>
            After crudely visualizing team data for a hackathon, I was happy when the owning team of
            our internal employee portal approached me to help build a visual representation of
            Airbnb 🤩.
          </p>
          <h3>An org chart, or an org chart?</h3>
          <p>
            Early in the project we realized that different employees had different expectations
            when they said "give me an org chart." We found there were two primary interpretations:
          </p>
          <ul>
            <li>Team hierarchy and composition</li>
            <li>Reporting structure</li>
          </ul>
          <p>
            Individual contributors thought about team hiearchies, while leaders and managers more
            often thought in terms of reporting lines. This tool was meant for the masses, and thus
            our primary focus was the former (though we have future plans for a second,
            reporting-focused view).
          </p>

          <h3>Visualizing team hierarchy and composition</h3>
          <p>
            The team and I set out specifically to visually depict{' '}
            <Emphasize>team size, team hierarchy, and functional composition</Emphasize> (where a
            function is a group of people who have the same role – designer, engineer, data
            scientist, etc. ). I led all visualization design and engineering, and co-led design of
            product information hierarchy and color palettes. <br /> <br />
            Here is our final result:
          </p>

          <ProjectImage src="/static/images/org-chart/org-chart.gif" />

          <h4>Left-panel</h4>
          <p>
            Because teams are fundamentally hiearchical, we employed a modified{' '}
            <Emphasize>Icicle Chart</Emphasize> as the primary mode of navigating teams. In a
            traditional Icicle Chart – first developed in 1983 by Kruskal and Landwher – the size of
            a given rectangle represents by the size of its sub-tree (i.e., the total number of
            people in that sub-org). In order to simplify our representation to make it more
            accessible to employees with lower data literacy levels, all team rectangles are the
            same size and reflect hierarchy alone, not size.
          </p>

          <h4>Right-panel</h4>
          <p>
            In order to acurately visualize team size and functional composition we created a new
            chart type, a hybrid of a circle pack chart and a donut chart ("circle pack donut").
          </p>

          <h3>Product evolution</h3>
          <h4>Team navigation</h4>
          <p>We explored two principle ways to navigate </p>
          <div className="flex">
            <ProjectImage
              src="/static/images/org-chart/prototype-nest.png"
              imageStyles={{ width: '24%' }}
            />
            <ProjectImage src="/static/images/org-chart/prototype-icicle.png" />
          </div>

          <h4>Circle pack donut chart</h4>
          <div className="flex">
            <ProjectImage src="/static/images/org-chart/circle-donut-prototype.png" />

            <ProjectImage
              src="/static/images/org-chart/donut-circle-pack-2.png"
              imageStyles={{ width: '70%' }}
            />
          </div>

          <h4>Color</h4>
          <ProjectImage
            src="/static/images/org-chart/palette.png"
            imageStyles={{ width: '20%', display: 'block', margin: 'auto' }}
          />

          <h4>The importance of data quality</h4>
          <p></p>

          <h3>Technology</h3>
        </div>
      </ProjectPage>
      <style jsx>{`
        h4 + p {
          margin-top: 0;
        }
        h4 {
          margin-bottom: 0;
        }
        li {
          list-style-type: disc;
        }
        .flex {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
        }
        @media (max-width: 1000px) {
          .flex {
            flex-flow: row wrap;
          }
        }
      `}</style>
    </>
  );
}

export default OrgChart;
