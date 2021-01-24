import React from 'react';
import Emphasize from '../../components/Emphasize';
import ProjectImage from '../../components/ProjectImage';

import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const slaTrackerProject = projects.filter(p => p.href === 'projects/sla-tracker')[0];

function SLATracker() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – SLA tracker"
        heroUrl="/static/images/sla-tracker/lineage-thumbnail.png"
        project={slaTrackerProject}
      >
        <div className="sla-tracker">
          <p>
            In this project we created a visual analytics tool for{' '}
            <Emphasize>understanding and facilitating a culture of data timeliness</Emphasize> at
            Airbnb, a critical part of our efforts to achieve high data quality.
          </p>
          <h3>Yes, data can be late</h3>
          <p>
            Anywhere with large-scale data processing pipelines, “raw” data sets are cleaned up,
            merged, and transformed into more structured data that powers product features or
            enables analytics to inform business decisions. This derived data must be “refreshed” at
            a regular interval (daily, hourly, etc.) and it’s industry standard for owners of
            datasets to commit to the availability of the fresh output data by a certain time each
            and every day. These{' '}
            <Emphasize>
              availability contracts for data freshness are called Service Level Agreements (SLAs)
            </Emphasize>
            .
          </p>
          <h3>Why are SLAs challenging?</h3>
          <ProjectImage
            src="/static/images/sla-tracker/dag-example.png"
            imageStyles={{ width: '33%', minWidth: 150 }}
          />
          <p>
            The availability of one dataset is intrinsically linked to a complex hierarchical
            “lineage” of data ancestors from which the dataset is derived. For the dataset of
            interest ("A" above) to meet its SLA requires orchestration of the entire dependency
            tree ("B-H" above), sometimes 100s of entities, to each meet their own availability
            SLAs. When things go wrong, the{' '}
            <Emphasize>
              juxtaposition of hierarchy and temporal sequence make SLAs particularly challenging to
              reason about without visual aid
            </Emphasize>
            .
          </p>

          <h3>Understanding timeliness issues</h3>

          <p>
            To enable identification of the root cause(s) of an SLA hit or miss for a single
            dataset, we designed the <Emphasize>Lineage View</Emphasize> which displays both
            hierarchical data lineage and landing time data of that asset.
          </p>
          <ProjectImage
            src="/static/images/sla-tracker/lineage.png"
            imageStyles={{ border: '1px solid #eaeaea' }}
          />
          <p>
            To enable reasoning about the sequence of landing times, this view was designed around a{' '}
            <Emphasize>dependency-inclusive Gantt chart</Emphasize> – an extension of the well-known
            Gantt chart – with the following features:
          </p>
          <ul>
            <li>
              <Emphasize>Each row represents a dataset</Emphasize> in the lineage, with the “final”
              (last to be computed) dataset of interest at the top.
            </li>
            <li>
              Each dataset has a{' '}
              <Emphasize>horizontal bar representing the start, duration, and end time</Emphasize>{' '}
              for its data processing job on the date or time selected.
            </li>
            <li>
              Visual markers indicate{' '}
              <Emphasize>distributions of typical start and end times</Emphasize>, which help data
              producers evaluate if the data processing job is ahead of schedule, or behind, putting
              its downstream data entities at risk.
            </li>
            <li>
              <Emphasize>Arcs</Emphasize> are drawn between parent and child data consumables so
              data producers can <Emphasize>trace the lineage</Emphasize> and see if the delay is
              caused by their upstream dependencies. Emphasized arcs represent the “bottleneck” path
              (see below for more).
            </li>
          </ul>

          <h3>Finding the needle in the haystack – "Bottlenecks"</h3>

          <p>
            The dependency trees for some datasets can be extremely large – 100s of entities –
            making it difficult to find the relevant, slow “bottleneck” datasets that delay the
            entire data pipeline. We were able to drastically reduce noise and highlight these
            problematic data entities by developing the concept of a{' '}
            <Emphasize>“bottleneck” path</Emphasize> – the{' '}
            <Emphasize>
              sequence of the latest-landing data ancestors which prevented a child data
              transformation from starting
            </Emphasize>
            , thus delaying the entire pipeline. The “bottleneck” sequence significantly reduces the
            complexity of the Gantt chart view.
          </p>
          <ProjectImage src="/static/images/sla-tracker/bottlenecks.png" />
          <p>
            To more easily understand lineage, users can switch from the Timeline View (Gantt chart)
            to the Tree View, which shows the same lineage data but emphasizes hierarchical
            dependencies. In this view, temporal “bottlenecks” are emphasized through edge color and
            thickness.
          </p>
          <ProjectImage src="/static/images/sla-tracker/graph-view.png" />
          <p>
            Data producers can also view detailed historical run times of a single data consumable.
            This visualization allows producers to distinguish whether delays were due to long run
            times or simply caused by starting later than normal, e.g., because an upstream
            dependency was delayed.
          </p>
          <ProjectImage
            src="/static/images/sla-tracker/historical-data.png"
            imageStyles={{ width: '80%' }}
          />

          <h3>Visual design</h3>
          <ProjectImage src="/static/images/sla-tracker/visual-design.png" />
          <p>
            The SLA Tracker introduces several visual elements that are reused in multiple views. To
            make these elements learnable and quickly understandable, we designed them with shared
            color palettes and textures across all views. Fill pattern indicates whether a data
            entity has “landed” (refreshed), while two color palettes indicate how early or late a
            data entity was relative to its SLA or typical landing time. All visual elements that
            represent data landing information have the same thickness, radius, and border style
          </p>

          <h3>Process</h3>
          <p>
            We prototyped the Gantt chart extensively with sample datasets before producing our
            final design. Our initial explorations focused on summarizing{' '}
            <Emphasize>landing time distributions</Emphasize>
            over time, which yielded{' '}
            <a target="_blank" href="https://xeno.graphics/">
              xenographic
            </a>{' '}
            Gantt chart box plots (below, left). The Gantt chart effectively shows duration, start,
            and end times for a single run, and we found that we could improve interpretation by
            using <Emphasize>arcs</Emphasize> to highlight hierarchical dependencies between
            entities (below, middle). Prototyping with large pipelines revealed the need for{' '}
            <Emphasize>reducing complexity</Emphasize>, which led us to develop the concept of
            “bottlenecks” to highlight the problematic steps in pipelines (below, right). After we
            were confident in our visualization, we refined the visual elements in static mocks in
            Figma before productionizing.
          </p>
          <ProjectImage src="/static/images/sla-tracker/prototype.png" />
          <p>
            We also evolved several text-heavy elements over time to make them more visual and
            effective. Here is an example of how we evolved our "current vs typical" landing time
            visual.
          </p>
          <ProjectImage src="/static/images/sla-tracker/typical-landing-time-evolution.png" />

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

export default SLATracker;
