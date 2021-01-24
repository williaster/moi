import React from 'react';
import Emphasize from '../../components/Emphasize';
import ProjectImage from '../../components/ProjectImage';

import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const metricExplorerProject = projects.filter(p => p.href === 'projects/metric-explorer')[0];

function MetricExplorer() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – Metric explorer"
        heroUrl="/static/images/metric-explorer/thumbnail.png"
        project={metricExplorerProject}
      >
        <div className="metric-explorer">
          <p>
            The Metric Explorer was designed to be an intuitive business analytics tool to{' '}
            <Emphasize>
              enable non-data experts to explore curated, high-quality metrics easily and with
              confidence
            </Emphasize>
            . Compared to other free-form data exploration platforms, it was designed with an
            opinionated feature set to reduce complexity and with extensive microinteractions that
            make data exploration easier.
          </p>
          <h3>Why build a custom analytics product?</h3>
          <p>
            Before the Metric Explorer, Airbnb had several (5+) major tools to support business
            analytics and reporting. Despite the plethora of options (and partially because of
            them), it was still hard to answer analytics questions. Some of the{' '}
            <Emphasize>major challenges</Emphasize>
            were:
          </p>
          <ul>
            <li>Disparate tools had different formats, framing, security, and discoverability.</li>
            <li>
              Different users had different usability needs – we were focused on employees who
              lacked data expertise and/or business context.
            </li>
            <li>
              No single tool supported the spectrum of tasks needed – from overview reporting to
              intuitive exploration that preserved business context.
            </li>
          </ul>
          <h3>Metric Explorer user journey</h3>
          <p>We designed the Metric Explorer user journey to address the pain points above:</p>
          <ul>
            <li>
              Provide <Emphasize>business context</Emphasize>
            </li>
            <li>
              Support <Emphasize>overview and deep-dive exploration</Emphasize> without losing
              context
            </li>
            <li>
              Simplified information architecture and well-designed microinteractions to support{' '}
              <Emphasize>varying levels of data expertise</Emphasize>
            </li>
          </ul>
          <ProjectImage src="/static/images/metric-explorer/user-journey.png" />
          <h3>Metric collections</h3>
          <p>
            Metric collections are{' '}
            <Emphasize>curated collections of metrics for every team at Airbnb</Emphasize>. Users
            with zero context could easily navigate company org structure to find a team of interest
            and immediate understand and explore the metrics they care about. This page provided
            overview reporting functionality with the needed business context.
          </p>
          <ProjectImage src="/static/images/metric-explorer/metric-collection.png" />

          <h3>Single metric exploration</h3>
          <p>
            From a metric collection, users can easily select a{' '}
            <Emphasize>single metric to transition into exploring it in depth</Emphasize> with group
            bys and filter controls (see below). During exploration, the{' '}
            <Emphasize>context of the collection from which the user came is preserved</Emphasize>,
            allowing easy navigation back to the overview collection. On the single metric page,
            <Emphasize>advanced users can explore extensive metadata</Emphasize> for the metric,
            such as SQL definitions, example queries, owners, table landing times, and more.
          </p>
          <ProjectImage src="/static/images/metric-explorer/single-metric.png" />

          <h3>The importance of microinteractions</h3>
          <p>
            Often, data products need to be used by data experts as well as non-technical users and
            designing an experience that satisfies both is challenging. We find that we can usually
            <Emphasize>make complex data tasks easier</Emphasize> for non-technical and technical
            users alike through
            <Emphasize>intentional microinteractions that abstract away complexity</Emphasize>. One
            example of this is the design of our filter and groupby components.
          </p>
          <p>Some key design notes:</p>
          <ul>
            <li>
              Non-technical users often don't know if their filter of interest is a{' '}
              <Emphasize>column or a column value</Emphasize>. We designed a robust typeahead which
              matches on both, as well as descriptions so users can more easily find values.
            </li>
          </ul>
          <ProjectImage
            src="/static/images/metric-explorer/filter-microinteractions.gif"
            imageStyles={{ width: '60%' }}
          />

          <ul>
            <li>
              Column names and values can get incredibly long and break the UI. Filter "chips"
              allowed us to accommodate full-length values during editing, and gracefully truncate
              upon save.
            </li>
          </ul>
          <ProjectImage
            src="/static/images/metric-explorer/truncation.png"
            imageStyles={{ width: '50%' }}
          />
          <ul>
            <li>
              Search term highlighting is often complex and de-prioritized in data products. We took
              the time to implement this well, e.g., truncating forwards or backwards depending on
              where in a sentence a match occurs.
            </li>
          </ul>

          <ProjectImage
            src="/static/images/metric-explorer/highlighting.png"
            imageStyles={{ width: '80%' }}
          />
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

export default MetricExplorer;
