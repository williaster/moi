import React from 'react';
import Emphasize from '../../components/Emphasize';
import ProjectImage from '../../components/ProjectImage';

import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';
import { boxShadow } from '../../theme';
import getStaticUrl from '../../utils/getStaticUrl';

const uscfProject = projects.filter(p => p.href === 'projects/ucsf')[0];

function UCSF() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – UC, San Francisco"
        heroUrl="/static/images/ucsf/thumbnail.png"
        project={uscfProject}
      >
        <div className="ucsf">
          <h3>What is spatial gene expression?</h3>
          <p>
            Most <Emphasize>cells in our body have functionally specialized regions</Emphasize>{' '}
            containing distinct sets of proteins. This complexity relies on the capacity of cells to
            generate, sustain, and regulate subcellular compartments.
          </p>
          <blockquote>
            For example, multi-cellular organisms begin from <strong>one</strong> cell, which lays
            the spatial blueprint for multi-cellular asymmetry (e.g., left hand, right foot) through
            localized gene expression.
          </blockquote>
          <p>
            How the cell achieves such asymmetry is not well understood because of limited
            experimental approaches for discovering and analyzing localized gene expression.
            Historical methods – such as microscopy – are generally low-throughput, enabling study
            of one or two genes at a time, not the 100s - 10,000s of total genes in an organism.
          </p>

          <h3>Genome sequencing primer</h3>
          <p>In the 2000s, genome sequencing had two major applications:</p>
          <ol>
            <li>
              <p>
                De-novo sequencing of unknown genomes (e.g., strawberry genome, or the cov-2 virus).
              </p>
            </li>
            <li>
              <p>
                Precisely quantifying <em>how much of which genes</em> are expressed under different
                conditions (e.g., which genes are over-expressed in cancer cells vs normal cells).
              </p>
            </li>
          </ol>

          <h3>Sequencing sub-regions of cells</h3>
          <p>
            To enable better study of localized gene expression, in grad school{' '}
            <Emphasize>
              I co-developed a genome sequencing approach to enable a <em>global</em> view of
              localized gene expression
            </Emphasize>{' '}
            within sub-compartments of cells with unprecedented precision.
          </p>
          <p>
            Our approach was built on a "ribosome profiling" method, previously developed in our lab
            to quantitatively analyze gene expression (#2 above). We refined this methodology to
            analyze localized sub-populations of ribosomes, the cellular machines that create
            proteins, encoded by genes. Our findings may guide the study of region-specific
            reactions in morphologically complex metazoan organisms.
          </p>
          <ProjectImage src="/static/images/ucsf/methodology.png" imageStyles={{ width: '50%' }} />
          <h3>Still reading?</h3>
          <p>Check out our papers:</p>

          <a target="_blank" href={getStaticUrl('/static/Science-2014-Jan-Williams.pdf')}>
            <div className="project-card">
              <div className="content">
                <h4 className="title">
                  Principles of ER cotranslational translocation revealed by proximity-specific
                  ribosome profiling
                </h4>
                <p className="authors">
                  Calvin H. Jan*, Christopher C. Williams*, Jonathan S. Weissman
                </p>
                <p className="citation">Science 346, (2014); DOI: 10.1126/science.1257521</p>
              </div>
              <div
                className="img"
                style={{
                  backgroundImage: `url(${getStaticUrl('/static/images/ucsf/er.png')})`,
                }}
              />
            </div>
          </a>

          <a target="_blank" href={getStaticUrl('/static/Science-2014-Williams-Jan.pdf')}>
            <div className="project-card">
              <div className="content">
                <h4 className="title">
                  Targeting and plasticity of mitochondrial proteins revealed by proximity-specific
                  ribosome profiling
                </h4>
                <p className="authors">
                  Christopher C. Williams*, Calvin H. Jan*, Jonathan S. Weissman
                </p>
                <p className="citation">Science 346, 748 (2014); DOI: 10.1126/science.1257522</p>
              </div>
              <div
                className="img"
                style={{
                  backgroundImage: `url(${getStaticUrl('/static/images/ucsf/mito.png')})`,
                }}
              />
            </div>
          </a>
        </div>
      </ProjectPage>
      <style jsx>{`
        ol li {
          list-style-type: decimal;
          list-style-position: inside;
          font-weight: bold;
        }
        li p {
          display: inline;
          font-weight: 300;
        }
        .project-card {
          color: #222;
          padding: 16px;
          max-width: 700px;
          min-height: 300px;
          background: white;
          border-radius: 4px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: row;
          box-shadow: ${boxShadow};
          cursor: pointer;
        }
        .title {
          margin-bottom: 0rem;
        }
        .img {
          width: 300px;
          min-height: 200px;
          flex-shrink: 0;
          border-radius: inherit;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .authors,
        .citation {
          margin-bottom: 1.75em;
          font-size: 0.8rem;
        }
        .citation {
          font-style: oblique;
        }
        @media (max-width: 600px) {
          .project-card {
            flex-direction: column-reverse;
          }
          .img {
            width: 100%;
            margin: 0;
          }
        }
      `}</style>
    </>
  );
}

export default UCSF;
