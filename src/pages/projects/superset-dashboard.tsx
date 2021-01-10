import React from 'react';
// @ts-ignore
import GithubButton from 'react-github-button';
import 'react-github-button/assets/style.css';
import FlexContainer from '../../components/FlexContainer';

import ProjectImage from '../../components/ProjectImage';
import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const supersetProject = projects.filter(p => p.href === 'projects/superset-dashboard')[0];

function OrgChart() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – Superset dashboard v2"
        heroUrl="/static/images/superset-dashboard-v2/thumbnail.png"
        project={supersetProject}
      >
        <div className="dashboard">
          <p>{supersetProject.subtitle}</p>
          <FlexContainer wrap alignItems="center">
            Read more in the&nbsp;
            <a
              target="_blank"
              href="https://gist.github.com/williaster/bad4ac9c6a71b234cf9fc8ee629844e5"
            >
              full release notes
            </a>
            &nbsp;or view Superset on&nbsp;
            <a target="_blank" href="https://github.com/apache/incubator-superset">
              Github
            </a>
            &nbsp;&nbsp;
            <GithubButton type="stargazers" namespace="apache" repo="incubator-superset" />
          </FlexContainer>

          <br />

          <ProjectImage src="/static/images/superset-dashboard-v2/superset-dashboard-v2.gif" />
          <h3>Major improvements</h3>
          <p>
            The new Superset Dashboard experience introduced several major improvements to the
            viewing and editing of dashboards. I was the tech lead and sole implementer. It was
            written from scratch in <code>React</code> and <code>redux</code>, and was meant to
            mirror the ease of creating web sites with Google Site Builder. Some highlights include:
          </p>

          <h4>Drag & drop dashboard components</h4>
          <ProjectImage src="/static/images/superset-dashboard-v2/drag-and-drop.png" />
          <p>
            Many new dashboard UI components were added and exposed in a new drag and drop builder
            interface to enable you to build more effective and intentional dashboard layouts
            easily.
          </p>

          <h4>Improved grid</h4>
          <ProjectImage src="/static/images/superset-dashboard-v2/grid.png" />
          <p>
            The new dashboard grid is more predictable and visually clear. It uses a more common
            12-column, which is more widely used because it supports a variety of widths for
            organizing content.
          </p>

          <h4>Undo/redo</h4>
          <ProjectImage src="/static/images/superset-dashboard-v2/undo-redo.gif" />
          <p>
            When editing a dashboard all of your actions are now undo/redo-able until you persist
            them via saving ✨! Ctrl+Z and Ctrl+Y keyboard shortcuts also work 😎
          </p>

          <h4>Add Charts directly from a Dashboard</h4>
          <ProjectImage src="/static/images/superset-dashboard-v2/superset-dashboard-v2.png" />
          <p>
            Now you can more easily and quickly navigate and add your charts to a dashboard from the
            builder side pane, instead of from the explore page. Note that you may only search and
            sort the charts you have edit permissions for.
          </p>

          <h4>Intentional hierarchies</h4>
          <ProjectImage src="/static/images/superset-dashboard-v2/hierarchy.png" />
          <p>
            The new dashboard experience included several new components to enable the creation of
            intentional page hierarchy for effective visual display of information. New components
            included: headers, dividers, top-level tabs, nested tabs, and markdown containers for
            formatted text or links.
          </p>

          <h4>Improved loading time</h4>
          <p>
            Dashboard load times can be improved through the use of Tabs, which enable breaking
            larger dashboards into smaller sections. The visualizations within a Tab are lazy-loaded
            meaning that they do not load until you select a Tab.
          </p>
        </div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default OrgChart;
