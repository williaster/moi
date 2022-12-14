import React from 'react';
import Link from 'next/link';
import ProjectImage from '../../components/ProjectImage';
import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const fryUniverseProject = projects.filter(p => p.href === 'projects/fry-universe')[0];

function FraudTrace() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – Fry universe 🍟"
        heroUrl="/static/images/fry-universe/hero.png"
        project={fryUniverseProject}
      >
        <div className="fry-universe">
          <p>
            Featured in FlowingData&apos;s{' '}
            <a
              target="_blank"
              href="https://flowingdata.com/2021/12/31/best-of-2021/"
              rel="noreferrer"
            >
              best vis projects of 2021
            </a>
            .
          </p>
          <p>
            What is the best french fry shape? After a lifetime of relying on my subjective instinct
            to answer this question, I decided to leverage (and learn) 3D modeling and WebGL to
            explore this question quantitatively. Read more below or{' '}
            <Link href="/fry-universe">explore the fry universe</Link> yourself.
          </p>
          <h3>Approach</h3>
          <p>
            With experience in data vis and an interest in learning more 3D modeling + WebGL, I
            decided this would be a perfect project for me. By modeling potato shapes{' '}
            <span role="img" aria-label="potato">
              🥔
            </span>{' '}
            in{' '}
            <a href="https://www.blender.org/" target="_blank" rel="noreferrer">
              Blender
            </a>
            , I could precisely calculate their surface area and volume, which of course correlate
            with the how much crispy exterior and fluffy interior they have. The ratio of
            fried:unfried would then allow objective ranking, and I could use{' '}
            <a href="https://threejs.org/" target="_blank" rel="noreferrer">
              three.js
            </a>{' '}
            (
            <a href="https://github.com/pmndrs/react-three-fiber" target="_blank" rel="noreferrer">
              react-three-fiber
            </a>{' '}
            specifically) to render them in a compelling way.
          </p>
          <h3>Models & data</h3>
          <p>
            First I created the 3D models in Blender. Although I explored realistic textures,
            ultimately I used simplified shaders because it enabled better transitioning between
            models and visualization representations.
          </p>
          <ProjectImage src="/static/images/fry-universe/blender.png" />
          <p>
            {' '}
            With the models in hand, I quantified the surface area and volume in order to validate
            my hypothesis that fried (surface area) to unfried (volume) ratios would vary across
            potato forms. I could have stopped with a vanilla bar chart, but my goal was to learn
            and create a more interesting 3D experience.
          </p>
          <ProjectImage src="/static/images/fry-universe/data.png" />
          <h3>Designing a 3D experience</h3>
          <p>
            In my experience it is more efficient to have a north star design for data
            visualizations before building them. I also wanted to prominently feature both the fry
            models and their data visualization representations, and so I explored several possible
            layouts and story-telling sequences.
          </p>
          <ProjectImage src="/static/images/fry-universe/design-1.png" />
          <p>
            Ultimately I decided that nested circles were my favorite visual representation, and
            this could also visually map to the 3D models in an intuitive way.
          </p>
          <ProjectImage src="/static/images/fry-universe/design-2.png" />
          <h3>Scrolly-telling in WebGL</h3>
          <p>
            With a target design, models, and data in hand I started building with{' '}
            <code>react-three-fiber</code>. I used &quot;scrolly-telling&quot; to transition between
            scenes to enable a clear derivation of the quantitative visual representation of the
            model data.
          </p>
          <ProjectImage
            src="/static/images/fry-universe/scrolly-telling.gif"
            imageStyles={{ height: '50vh', width: 'auto' }}
          />
          <p>
            With the basics in place, I refined the visual shading and transitions. Since this was
            one of my first 3D projects, each visual effect provided a great learning experience.
            One example was creating a &quot;toon&quot; shader that transitioned to a mesh form in
            response to scroll – scroll was mapped to shader uniforms to achieve the effect.
          </p>
          <div className="flex">
            <ProjectImage
              src="/static/images/fry-universe/toon-shading.png"
              imageStyles={{ width: '75%', height: '75%', marginRight: 8, minWidth: 'unset' }}
            />
            <ProjectImage
              src="/static/images/fry-universe/toon-shading-2.gif"
              imageStyles={{ width: '25%', height: 'auto', minWidth: 'unset' }}
            />
          </div>
          A second visual effect I invested time in was transitioning fry models. I applied this to
          transition fry models to their visualization representation, and also to transition
          between fry models. This required careful mapping of mesh indices and sampling triangles
          across representations because the number of triangles across models varies widely.
          <div className="flex">
            <ProjectImage
              src="/static/images/fry-universe/morph-fry.gif"
              imageStyles={{ width: '50%', height: '50%', marginRight: 8, minWidth: 'unset' }}
            />
            <ProjectImage
              src="/static/images/fry-universe/morph-fry-2.gif"
              imageStyles={{ width: '50%', height: '50%', minWidth: 'unset' }}
            />
          </div>
          <p>
            Overall this was a blast to work on and clearly answers an important question for
            humanity. Thanks for reading and if you haven&apos;t already, definitely{' '}
            <Link href="/fry-universe">explore the fry universe</Link> yourself!
          </p>
        </div>
      </ProjectPage>
      <style jsx>{`
        .flex {
          display: flex;
          flex-direction: row;
          flex-wrap: no-wrap;
          align-items: center;
        }
      `}</style>
    </>
  );
}

export default FraudTrace;
