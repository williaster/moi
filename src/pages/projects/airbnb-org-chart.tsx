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
            Individual contributors thought about team hierarchies, while leaders and managers more
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
            Because teams are fundamentally hierarchical, we employed a modified{' '}
            <Emphasize>Icicle Chart</Emphasize> as the primary mode of navigating teams, where each
            rectangle represents a team or sub-team. In a traditional Icicle Chart – first developed
            in 1983 by Kruskal and Landwher – the area of a given rectangle represents the size of
            its sub-tree (i.e., the total number of people in that rectangle's sub-org). In order to
            simplify our representation, to make it more accessible to employees with less technical
            expertise, all team rectangles are the <em>same size</em> and reflect team hierarchy
            alone, not size.
          </p>

          <h4>Right-panel</h4>
          <p>
            In order to simultaneously visualize team size and functional composition we created a
            new chart type: the <Emphasize>Circle Pack Donut Chart</Emphasize>. The circle packing
            allows us to intuitively visualize team nesting, and by wrapping each circle in a donut
            chart we could effectively capture function composition, a categorical data type.
          </p>

          <h3>Product evolution</h3>
          <h4>Hackathon</h4>
          <p>
            In 2017 before our team set out to intentionally build a quality org chart data product,
            I crudely visualized our org data for a hackathon project. I used "scrolly-telling" to
            present different views of the data (team size, hierarchy, time trends, reporting
            structure). While this sparked the idea to build a proper internal tool,{' '}
            <Emphasize>
              designing a data product is vastly different from designing a visualization
            </Emphasize>
            . We had to significantly simplify the interface and reduce the scope of the tool so it
            would be useable by employees of all data literacy levels. We focused only on team
            hierarchy and function composition and ignored all historic data.
          </p>
          <ProjectImage src="/static/images/org-chart/hackathon.gif" />

          <h4>Team navigation</h4>
          <p>We explored two principal layouts to navigate hierarchical teams:</p>
          <ul>
            <li>Nested folder layout</li>
            <li>Icicle chart layout</li>
          </ul>

          <div className="flex">
            <ProjectImage
              src="/static/images/org-chart/prototype-nested.gif"
              imageStyles={{ width: '20%' }}
            />
            &nbsp;&nbsp;
            <ProjectImage src="/static/images/org-chart/prototype-icicle.gif" />
          </div>

          <p>
            The nested folder layout allows for information in the right panel, while the icicle
            layout takes up the majority of the page. Ultimately we found that dedicating more space
            to the visualization panel (using the folder layout) made the page feel more
            information-dense and complex, and opted for the icicle layout.
            <br />
            <br />
            The biggest limitation with the icicle layout is the requirement for horizontal page
            scrolling when team depth gets too large, but this was rare for us.
          </p>

          <h4>Circle pack donut chart</h4>
          <p>
            This chart type developed from a desire to show both hierarchical team structure and
            categorical function composition. After the obvious two-visualization approach I decided
            to merge the two visuals to achieve a more compact, useful, and unique visual.
          </p>

          <div className="flex">
            <ProjectImage
              src="/static/images/org-chart/donut-and-circle.png"
              imageStyles={{ width: '54%' }}
            />

            <ProjectImage src="/static/images/org-chart/circle-donut-prototype.png" />

            <ProjectImage
              src="/static/images/org-chart/donut-circle-pack-2.png"
              imageStyles={{ width: '70%' }}
            />
          </div>

          <p>
            In the final iteration (last image) we moved the outermost donut chart to a single
            stacked bar representation. This allowed us to provide more detail for the selected team
            through a legend of function names and counts (legends across nested teams are not the
            same, inner team functions are usually subsets of the parent team superset).
          </p>

          <p>
            The principal challenge of using a circle pack layout in a polished product is its
            layout proportions. Because the outer circle must have equal width and height, we
            couldn't make it wide without pushing other content below the fold.
            <br />
            <br />
            Ideally we could layout the outer-most circles in a rectangle, where width could be
            larger than height. We explored this some – including a treemap circle pack donut chart
            – but did not implement a custom circle pack algorithm.
          </p>

          <div className="flex">
            <ProjectImage src="/static/images/org-chart/rectangle-circle-pack.png" />
            <ProjectImage src="/static/images/org-chart/treemap-donut-circle.png" />
          </div>

          <h4>Color</h4>

          <p>
            The primary color palette we designed for this product was for mapping of functions
            (design, engineering, etc.). The primary challenge was the large number of functions;
            Top-level teams frequently had over 20 functions, many more than we would ideally
            represent with color for maximal differentiation (approximately ~6) . Differentiability
            was not critical for the success of this view, and by using 3 levels of brightness for
            each of 6 hues we were able to mostly avoid function color conflicts (i.e., using the
            same color for multiple functions).
          </p>
          <ProjectImage
            src="/static/images/org-chart/function-palette.png"
            imageStyles={{ width: '80%' }}
          />

          <h3>Technology</h3>
          <p>This web app was built with using the following technologies:</p>
          <ul>
            <li>
              <a href="https://reactjs.org/" target="_blank">
                React
              </a>{' '}
              for UI components
            </li>
            <li>
              Airbnb's{' '}
              <a href="https://airbnb.io/visx/" target="_blank">
                visx
              </a>{' '}
              for visualizations
            </li>
            <li>
              <a href="https://www.react-spring.io/" target="_blank">
                react-spring
              </a>{' '}
              for visualizations animations
            </li>
            <li>
              <a href="https://www.apollographql.com/" target="_blank">
                Apollo / GraphQL
              </a>{' '}
              for data fetching
            </li>
            <li>
              <a href="https://nextjs.org/" target="_blank">
                Next.js
              </a>{' '}
              for app creation
            </li>
          </ul>
          <br />
          <br />
          <br />
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
