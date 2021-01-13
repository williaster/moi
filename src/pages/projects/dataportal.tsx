import React from 'react';
import Emphasize from '../../components/Emphasize';
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
          <p>
            Read more in the{' '}
            <a
              target="_blank"
              href="https://medium.com/airbnb-engineering/democratizing-data-at-airbnb-852d76c51770"
            >
              Medium blog post
            </a>
            &nbsp; or watch our{' '}
            <a
              target="_blank"
              href="https://neo4j.com/videos/democratizing-data-at-airbnb-chris-williams-and-john-bodley-airbnb/"
            >
              2017 talk on the Dataportal
            </a>{' '}
            at Neo4j GraphConnect Europe.
          </p>
          <h3>Democratizing data at Airbnb</h3>
          <p>
            As Airbnb grew, so did the challenges around the volume, complexity, and obscurity of
            data. Information and people became siloed which necessitated navigating an invisible
            landscape of tribal knowledge. This was an inefficient use of time for people on the
            journey and for those providing directions.
          </p>
          <p>
            <Emphasize>
              The Dataportal is a data product we built to enable autonomy and best practices with
              data
            </Emphasize>
            , providing guard rails where necessary. Our hope is that any employee, regardless of
            role, can easily find or discover data and feel confident about its trustworthiness and
            relevance.
          </p>

          <h3>The Dataportal graph</h3>
          <p>
            To address the pain points above we built a data tool to improve data discoverability
            and exploration within Airbnb. We modeled our entire data ecosystem as a{' '}
            <Emphasize>knowledge graph</Emphasize> of nodes and edges. Nodes are the various
            resources: data tables, dashboards, reports, users, teams, business outcomes, etc. Their
            connectivity reflects their relationships: consumption, production, association, etc.
          </p>
          <ProjectImage src="/static/images/dataportal/graph.png" />

          <h3>The Dataportal product</h3>
          <p>The v0 of our Dataportal tool included four major product features:</p>
          <h4>Search</h4>
          <ProjectImage src="/static/images/dataportal/search.png" />
          <p>
            The most important feature of the Dataportal is a <Emphasize>unified search</Emphasize>{' '}
            across our entire data ecosystem. Employees can search logging schemas, data tables,
            charts, dashboards, employees, and teams. We surface as much metadata about resources as
            possible in search cards to build context and trust.
          </p>
          <h4>Data assets</h4>
          <ProjectImage src="/static/images/dataportal/entity.png" />
          <p>
            From search a user can further explore a resource by visiting its{' '}
            <Emphasize>detailed data asset page</Emphasize>. Data without context is often
            meaningless and can lead to ill-informed and costly decisions. Therefore content pages
            surface all of the information we have for a resource across data tools to show how it
            fits into the entire data ecosystem: <Emphasize>who has consumed</Emphasize> a resource,{' '}
            <Emphasize>who created it</Emphasize>, <Emphasize>when</Emphasize> it was{' '}
            <Emphasize>created or updated</Emphasize>, which other resources it’s related to, etc.
          </p>

          <h4>Employee-centric data</h4>
          <ProjectImage src="/static/images/dataportal/user.png" />
          <p>
            <Emphasize>Employees are the ultimate holders of tribal knowledge</Emphasize> so we
            created a dedicated user page to reflect this. We consolidate all of the data resources
            an employee has created, consumed, or favorited. Any employee in the company can view
            the page of any other employee, which promotes transparency from both production and
            consumption standpoints.
          </p>

          <h4>Team-centric data</h4>
          <ProjectImage src="/static/images/dataportal/team.png" />
          <p>
            Another source of tribal knowledge within Airbnb is teams. Teams have tables they query,
            dashboards they create and view, team metrics they track, etc. We found that employees
            spend a lot of time telling people about the same resources so we designed a way for
            them to link to and curate these popular items.
          </p>
        </div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default Dataportal;
