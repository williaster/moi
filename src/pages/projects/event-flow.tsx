import React from 'react';
import ProjectImage from '../../components/ProjectImage';
import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const eventFlowProject = projects.filter(p => p.href === 'projects/event-flow')[0];

function GeoExplorer() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – Event flow"
        heroUrl="/static/images/data-ui/event-flow-overview.png"
        project={eventFlowProject}
      >
        <div className="event-flow">
          <p>{eventFlowProject.subtitle}</p>
          <ProjectImage src="/static/images/data-ui/event-flow.gif" />
          <h3>Overview</h3>
          <p>
            This visualization is inspired by a{' '}
            <a
              href="https://www.cs.umd.edu/~ben/papers/Wongsuphasawat2011LifeFlow.pdf"
              target="_blank"
            >
              2011 LifeFlow paper
            </a>{' '}
            from Ben Shneiderman's group. It is meant to facilitate finding aggregate patterns in
            event sequences. It takes multiple user (or generically entity) event sequences as input
            and aggregates similar sequences together using the following visual paradigm:
          </p>
          <ProjectImage src="/static/images/data-ui/event-flow-overview.png" />

          <h3>Features</h3>
          <p>The visualization has a variety of features to facilitate exploratory analysis</p>

          <h4>Event alignment</h4>
          <p>
            Users can align event sequences by an arbitrary event _index_ and event _type_ (e.g.,
            the 2nd click event). This operation can actually filter out event sequences, e.g., if
            you align by th 3rd event and a sequence only has 2 events or if you align by the first
            event type "x" and a specific sequence has no events of that type. Filtered nodes are
            shown visually with a pattern line root node, and in the legend.
          </p>

          <h4>Event type filtering</h4>
          <p>
            Users can filter to / filter out specific types of events by clicking on the legend in
            the right panel. This operation still aligns the fully unfiltered sequences, but then
            hides relevant event types from view. The number of hidden events is shown in the right
            panel.
          </p>

          <h4>Raw sequence view</h4>
          <p>
            By clicking on any node or edge in the aggregate view, the aggregate panel will filter
            to the selected subtree and users can view the raw sequences captured by that selection
            in the bottom panel. You can hide the panel to explore the aggregate view, or clear the
            selection to return to the unfiltered view.
          </p>

          <h4>Event type breakdown</h4>
          <p>
            A breakdown of event type counts is displayed as a pie chart in the right pane. This
            breakdown also displays the number of filtered or hidden events depending on the vis
            state.
          </p>

          <h4>X-axis -- elapsed time vs sequence</h4>
          <p>
            By default, aggregate nodes are positioned according to the mean elapsed time from the
            _previous_ node. It can be hard to differentiate closely-spaced events, so the vis also
            supports positioning nodes by sequence number (1st, 2nd, 3rd, etc) with equal spacing
            between events.
          </p>

          <h4>Node sorting (vertical)</h4>
          <p>
            By default nodes are ordered top ➡️ bottom based on high ➡️ low event count, meaning
            that the most common nodes appear at the top. Users can also order by short ➡️ long
            elapsed time to the next event.
          </p>

          <h4>Trimming</h4>
          <p>
            To improve visualization / web app performance and to reduce visual noise, nodes which
            represent less than a minimum number of events can be hidden. Again, all events are
            considered for sequence alignment, but 'leaf' nodes are hidden from view.
          </p>

          <h4>Zooming</h4>
          <p>X- and Y-axis zoom + Panning is supported with common mouse movements.</p>
        </div>
      </ProjectPage>
      <style jsx>{``}</style>
    </>
  );
}

export default GeoExplorer;
