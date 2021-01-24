import React from 'react';
import Emphasize from '../../components/Emphasize';
import ProjectImage from '../../components/ProjectImage';
import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const pinProject = projects.filter(p => p.href === 'projects/pin-map')[0];
const imageStyles = { marginBottom: 24 };

function PinProject() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – 10 years of Airbnb pin map"
        heroUrl="/static/images/pin-map/hero.png"
        project={pinProject}
      >
        <div className="pin-map">
          <p>
            In collaboration with the Environments team – our in-house architects – we designed a
            physical visualization representing Airbnb’s growth over 10 years.
          </p>

          <h3>Interpretation</h3>
          <ProjectImage src="/static/images/pin-map/pins-far.png" />
          <p>
            This visualization uses physical pins of different colors to showcase Airbnb's growth in
            Europe during 2008 – 2017.{' '}
            <Emphasize>Each pin represents all listings in a 2km (1.25 mile) radius</Emphasize>, and
            the pin{' '}
            <Emphasize>
              color represents the <em>first year</em> that Airbnb had a listing in that location
            </Emphasize>
            . In total there were 93,464 pins. To give a sense of growth, we had a total of 57 pins
            representing 2008 and 18,311 pins representing 2015.
          </p>
          <div className="flex">
            <ProjectImage src="/static/images/pin-map/pins-legend.png" />
            &nbsp;
            <ProjectImage src="/static/images/pin-map/pins-close.png" />
          </div>

          <h3>Process and challenges</h3>
          <p>
            This project began with the acquisition of a 22 x 8 foot quilted map of Europe in the
            lead up to Airbnb's 10-year anniversary. We sought to visually represent Airbnb growth
            during those 10 years using pins as described above.
          </p>
          <div className="flex">
            <ProjectImage
              src="/static/images/pin-map/quilt-dimensions.png"
              imageStyles={imageStyles}
            />
            &nbsp;
            <ProjectImage src="/static/images/pin-map/quilt-empty.jpg" imageStyles={imageStyles} />
          </div>

          <h4>Digital exploration</h4>
          <p>
            To turn this vision into a reality we first explored this growth digitally. The image
            below shows Airbnb growth over 10 years, where each point is colored by the year in
            which Airbnb first had a listing in that location. Notice how listings first appeared in
            city centers and grew to rural areas over time.
          </p>
          <ProjectImage src="/static/images/pin-map/digital-years.gif" imageStyles={imageStyles} />
          <p>
            We also explored showing the <em>total number of Airbnb listings</em> in a given
            location using height. Typically the locations which had Airbnb listings early on also
            have more listings after 10 years because they had more time to accumulate listings. We
            ultimately abandoned the idea of capturing listing quantity because it would be too
            difficult to capture in a physical representation.
          </p>
          <ProjectImage
            src="/static/images/pin-map/pin-map-digital.gif"
            imageStyles={imageStyles}
          />
          <h4>Mapping from digital to physical</h4>
          <p>
            After developing our digital representation of growth, we needed to productionize it
            into a physical form.{' '}
            <Emphasize>
              We planned to represent each point in our digital visualization with a physical pin
            </Emphasize>
            . To accommodate these pins, we canvased our European map quilts on top of a cork
            backing, into which pins could be pushed. To do this accurately, the{' '}
            <Emphasize>
              points in our digital representation had to be scaled to precisely match the size of a
              physical pin
            </Emphasize>
            . After this scaling we could accurately estimate the number of pins we needed for each
            year, 93,464 in total. We also had to transform our digital color palette into one that
            was commercially available.
          </p>
          <ProjectImage src="/static/images/pin-map/pins.jpg" imageStyles={{ width: '40%' }} />
          <h4>Logistics of installation</h4>
          <p>
            Next we had to plan the logistics of the actual installation of our physical pin map. In
            order to place 90k points with high fidelity – each point a particular color and in a
            specific geo-spatial position – we needed some type of physical stencil.
          </p>
          <p>
            After exploring numerous ideas – from light projection to transfer paper – we landed on
            printing out the digital visualization on paper, which would require another precise
            scaling from the digital to physical world. The idea was to overlay the paper stencils
            atop the quilt map, allowing precise placement of pins of specific colors. Then we could
            wet the paper and pull it away, leaving only the quilt and pins.
          </p>
          <div className="flex">
            <ProjectImage
              src="/static/images/pin-map/trace-installation.jpg"
              imageStyles={imageStyles}
            />
            &nbsp;
            <ProjectImage
              src="/static/images/pin-map/quilt-tracing.jpg"
              imageStyles={imageStyles}
            />
          </div>
          <h4>Installation</h4>
          <p>
            Finally we were ready to create the actual physical form of our visualization. Actually
            placing 90k pins is not trivial, and so we decided to outsource it to employees. We
            hosted many "pin parties" where employees could come add some pins, and ultimately left
            pins up long-term so that Airbnb new hires, or passing guests could go spend some time
            adding pins in locations that had not been completed.
          </p>
          <div className="flex">
            <ProjectImage
              src="/static/images/pin-map/pin-installation-1.png"
              imageStyles={{ ...imageStyles, width: '71%' }}
            />
            &nbsp;
            <ProjectImage
              src="/static/images/pin-map/pin-installation-2.jpg"
              imageStyles={{ width: '39%' }}
            />
          </div>
          <br />
          <br />
          <br />
        </div>
      </ProjectPage>
      <style jsx>{`
        .flex {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: center;
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

export default PinProject;
