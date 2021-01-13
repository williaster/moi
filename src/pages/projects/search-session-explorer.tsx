import React from 'react';
import Emphasize from '../../components/Emphasize';
import ProjectImage from '../../components/ProjectImage';
import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const searchProject = projects.filter(p => p.href === 'projects/search-session-explorer')[0];

function SearchExplorer() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – Search session explorer"
        heroUrl="/static/images/search-session-explorer/hero.png"
        project={searchProject}
      >
        <div className="search-explorer">
          <p>
            In contrast to funnel analysis – in which user event sequences are analyzed in aggregate
            – this tool was developed to explore{' '}
            <Emphasize>single-user search session evolution</Emphasize>. The product was developed
            in collaboration with our Search Ranking team to understand the dynamics of a search
            session – search filter evolution, map movement, and interaction with results.
          </p>
          <ProjectImage src="/static/images/search-session-explorer/search-session-explorer.gif" />
          <h3>Interpretation</h3>
          <p>
            The interface was built to mirror key features of Airbnb.com search, encoding data into
            several custom small visualizations and glyphs. Users of the tool could select search
            sessions which met some criteria (new users, users who booked, search location, search
            filters, etc.).
          </p>
          <ProjectImage src="/static/images/search-session-explorer/search-session-sketch.png" />
        </div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default SearchExplorer;
