import React from 'react';
import ProjectImage from '../../components/ProjectImage';

import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const bikeProject = projects.filter(p => p.title.toLowerCase().includes('polka dot'))[0];
const imageStyles = { marginTop: 16, marginRight: 16 };

function Bike() {
  return (
    <>
      <ProjectPage
        title="chris williams – Polka dot bike design"
        heroUrl="static/images/bike/figma.png"
        project={bikeProject}
      >
        <p>
          I bike{' '}
          <a target="blank" href="https://www.strava.com/athletes/1153632">
            a lot
          </a>
          . So much that in 2018 I broke my bike frame and ended up with a stock warranty
          replacement. I didn't like the bland white color so designed my own paint job 💖.
        </p>
        <p>
          I had never done anything like this but figured Figma would work and so explored several
          color palettes and designs. After some back and forth with the{' '}
          <a target="_blank" href="http://www.carbonsolutionsrepair.com/">
            shop
          </a>{' '}
          who would do the painting, I settled on two colors and a lot of polka dots:
        </p>
        <div className="flex">
          <ProjectImage src="static/images/bike/colors.png" />
          <ProjectImage src="static/images/bike/figma-0.png" />
          <ProjectImage src="static/images/bike/figma-1.png" />
          <ProjectImage src="static/images/bike/figma.png" />
        </div>

        <h3>Coming to life</h3>
        <p>
          The process took roughly 6 months start to finish. As someone who mostly designs
          digitally, it was awesome to see a design become physical.
        </p>
        <div className="flex">
          <ProjectImage src="static/images/bike/mid-0.jpg" imageStyles={imageStyles} />
          <ProjectImage src="static/images/bike/mid-1.jpg" imageStyles={imageStyles} />
        </div>

        <h3>The fun part</h3>
        <div className="flex">
          <ProjectImage src="static/images/bike/final-1.jpg" imageStyles={imageStyles} />
          <ProjectImage src="static/images/bike/final-0.jpg" imageStyles={imageStyles} />
        </div>
        <br />
        <br />
        <br />
      </ProjectPage>
      <style jsx>{`
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

export default Bike;
