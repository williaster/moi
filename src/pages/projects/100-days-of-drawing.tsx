import React from 'react';
import Emphasize from '../../components/Emphasize';
import ProjectImage from '../../components/ProjectImage';
import ProjectPage from '../../components/ProjectPage';
import projects from '../../projects';

const hundoProject = projects.filter(p => p.href === 'projects/100-days-of-drawing')[0];

function HundredDaysOfDrawing() {
  return (
    <>
      <ProjectPage
        title="Chris Williams – 100 days of drawing"
        heroUrl="/static/images/100-days-of-drawing/collage.jpg"
        project={hundoProject}
      >
        <div className="100-days">
          <p>
            Although I feel comfortable using digital design tools like <em>Illustrator</em> and{' '}
            <em>Figma</em> as part of my day-to-day visualization work, my background is not in
            design and I've always wanted to feel more comfortable and confident in my ability to
            draw. Not only would this enable me to better sketch visualization ideas, it would also
            reinforce visual thinking and the grounding of my process in visuals.
          </p>
          <h3>Project "rules"</h3>
          <p>
            With extra time during the covid pandemic I decided to pursue 100 days of drawing in a
            row. I approached the project was as follows:
          </p>
          <h4>Time</h4>
          <p>
            Minimally I had to spend <Emphasize> 5 minutes per day drawing</Emphasize>, and I could
            spend more than one day on the same drawing. 90% of days I spent an hour or more, but on
            days when I really didn't have a lot of time, 5 minutes was still very achievable.
          </p>
          <h4>Medium</h4>
          <p>
            All drawing would be done on the iPad so I could digitize them easily. I used{' '}
            <a
              target="_blank"
              href="https://apps.apple.com/us/app/tayasui-sketches-pro/id671867510"
            >
              Sketches Pro
            </a>{' '}
            which supports multiple brush types, layers, and copy/paste.
          </p>
          <h4>What to draw</h4>
          <p>
            On a given day I would choose an image from an inspiration{' '}
            <a target="_blank" href="https://www.pinterest.com/williaster/draw-me/">
              Pinterest board
            </a>{' '}
            I made of sketches and drawings of all sorts. Because I wanted to focus on repitition of
            fundamentals, I largely tried to <em>replicate</em> images from others rather than{' '}
            <em>de novo</em> creation of visuals on my own.
          </p>
          <h3>The result</h3>
          <p>Below is a collage of a selection of ~50 drawings.</p>
          <ProjectImage src="/static/images/100-days-of-drawing/collage.jpg" />
          <h4>Favorites</h4>
          <p>The following are some of my favorites:</p>
          <div className="flex">
            <ProjectImage src="/static/images/100-days-of-drawing/favorite-0.jpg" />
            &nbsp;
            <ProjectImage src="/static/images/100-days-of-drawing/favorite-1.jpg" />
            &nbsp;
            <ProjectImage src="/static/images/100-days-of-drawing/favorite-2.jpg" />
            &nbsp;
            <ProjectImage src="/static/images/100-days-of-drawing/favorite-3.jpg" />
          </div>

          <h3>Learnings</h3>
          <p>
            I grew in several ways from 100 days of drawing and would encourage anyone who wants to
            draw more to try it. Some of my major takeaways:
          </p>

          <h4>Imperfection</h4>
          <p>
            The biggest contributor to my reluctance to draw before this project was my
            perfectionist tendencies, which created a false pretense that every drawing had to be
            perfect. Particularly on days where I didn't have a lot of time, I was forced to become
            comfortable with <Emphasize>just drawing something</Emphasize>. This helped me
            appreciate that:
          </p>
          <ul>
            <li>
              Perfection doesn't have to be the primary purpose of drawing. In fact I learned more
              from drawings that were imperfect than the ones that went according to plan.
            </li>
            <li>
              Like anything else, getting good at drawing takes a lot of practice and building of
              experience. Perfection as a mental block for drawing is fundamentally at odds with
              gaining experience.
            </li>
          </ul>

          <h4>Process</h4>
          <p>
            With little formal drawing experience prior to this project, I really was ignorant to
            the process of creating a complex drawing. It was fun to flesh out a process of
            sketching followed by more intentional and precise outlines, then simple fills followed
            by additional details and layers of shading. In hindsight this iterative approach should
            have been obvious from the process of iteration I embrace at work.
          </p>

          <h4>Craft</h4>
          <p>
            In my current digital profession, one of the things I miss most from my past life spent
            in a science lab is the sense of physical craft and precision that comes with working
            with your hands – good experiment hands we called it. It's no surprise, then, that one
            of my favorite things from 100 days of drawing was crafting things with my hands,
            practicing fine motor control and muscle memory day to day. I came to appreciate how
            much of precision drawing comes from this ability, which only experience can build.
          </p>

          <h3>What's next?</h3>
          <p>
            As I had hoped, this project has helped me be more comfortable doodling and sketching
            for work and for fun. I'm currently scheming another 100 days project of my own drawings
            rather than replicates.
          </p>
        </div>
      </ProjectPage>
      <style jsx>{`
        h4 + p {
          margin-top: 0;
        }
        h4 {
          margin-bottom: 0;
        }
        li {
          list-style-type: disc;
        }
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

export default HundredDaysOfDrawing;
