import React from 'react';
import Emphasize from '../../components/Emphasize';
import ProjectImage from '../../components/ProjectImage';

import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const geoExplorerProject = projects.filter(p => p.href === 'projects/geo-explorer')[0];

function GeoExplorer() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – SLA tracker"
        heroUrl="/static/images/geo-explorer/geo-explorer-light.png"
        project={geoExplorerProject}
      >
        <div className="geo-explorer">
          <p>
            The overarching goal of the Geo Explorer – a collaboration with the Marketplace Dynamics
            team – was to improve global market level insights & forecast. We sought to
            <ul>
              <li>
                <Emphasize>Align markets with administrative boundaries</Emphasize>
              </li>
              <li>
                <Emphasize>Improve market coverage </Emphasize> – the fraction of Airbnb listings
                with an associated market
              </li>
              <li>
                Define markets that{' '}
                <Emphasize>accurately capture our guest consideration set</Emphasize> – i.e., group
                listings within a single guest search session into the same market
              </li>
            </ul>
          </p>
          <h3>The Geo Explorer</h3>
          <p>
            To realize the above goals, we developed a simple map interface which enabled precise
            interactive comparison of different versions of market definitions.
          </p>
          <ProjectImage src="/static/images/geo-explorer/geo-explorer.gif" />
          <p>
            The product was built with Uber's{' '}
            <a target="_blank" href="https://deck.gl/">
              deck.gl
            </a>
            , and two linked map panes enabled one version of a market over another.
          </p>
          <ProjectImage src="/static/images/geo-explorer/market-comparison.png" />
          <p>
            For performance optimizations (global datasets are large!) we loaded and rendered market
            definitions based on spatial data indexes. This was done using Uber's{' '}
            <a target="_blank" href="https://eng.uber.com/h3/">
              H3 framework
            </a>{' '}
            – a global hexagonal grid for spatial binning.
          </p>

          <div>
            <ProjectImage src="/static/images/geo-explorer/spatial-data-indexing.gif" />
          </div>

          <h3>Outcomes</h3>
          <ul>
            <li>
              Produced a simple & concise interactive tool that allowed stakeholders to provide
              feedback on new definitions
            </li>
            <li>Reached nearly 99% market coverage of all Airbnb listings</li>
            <li>Aligned market to administrative boundaries</li>
            <li>Generated markets that accurately capture guest considerations sets</li>
          </ul>
          <br />
          <br />
          <br />
        </div>
      </ProjectPage>
      <style jsx>{`
        li {
          list-style-type: disc;
        }
      `}</style>
    </>
  );
}

export default GeoExplorer;
