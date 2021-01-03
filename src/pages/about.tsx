import React from 'react';
import Link from 'next/link';
import Page from '../components/Page';
import TimeDuration from '../components/TimeDuration';
import { boxShadow, colors, mutedBlack, reds } from '../theme';
import BackgroundCircle from '../components/BackgroundCircle';
import Emphasize from '../components/Emphasize';

function AboutPage() {
  return (
    <Page title="chris williams – about">
      <BackgroundCircle color={`${reds[0]}66`} />
      <BackgroundCircle position="bottom" color={`${colors[colors.length - 1]}22`} />
      <div className="about">
        <div className="header">
          <h2>About</h2>
          <p>
            I am passionate about <Emphasize>interface design and engineering</Emphasize>. My
            background in genome sequencing led me to develop a love for{' '}
            <Emphasize>data visualization</Emphasize> which opened the door to frontend engineering,
            design, & product design.
            <br />
            <br />I have <TimeDuration start="2012-01-01" end={new Date().toUTCString()} />+ years
            experience crafting complex data visualizations and data tools that power data
            intelligence at many major companies, and have contributed to several large open-source
            software <Link href="/projects">projects</Link>.
          </p>
        </div>

        <div className="skills">
          <h3>Skills</h3>
          <ul>
            <li>
              Frontend & data vis engineering (TypeScript, CSS, React, GraphQL, d3, WebGL, redux)
            </li>
            <li>Figma/Illustrator design & prototyping</li>
            <li>Data analysis (SQL, Machine Learning, stats)</li>
            <li>Product managment</li>
            <li>User research</li>
            <li>Full-stack engineering (Python, Java, Ruby)</li>
            <li>Academic & blog post writing</li>
          </ul>
        </div>
        <div className="experience">
          <h3>Experience</h3>
          <div className="card">
            <h3>Airbnb</h3>
            <div className="subtitle">
              Staff Engineer – Data Visualization • 2016-current (
              <TimeDuration start="2016-01-01" end={new Date().toUTCString()} /> years)
            </div>
            <p>
              <ul>
                <li>
                  Co-created and was the tech lead for a 10-person{' '}
                  <Emphasize>Data Experience</Emphasize> (DX) team, consisting of engineers,
                  designers, product managers, and researchers with domain expertise in data
                </li>
                <li>
                  Drove collaborations with <Emphasize>20+ teams</Emphasize> across most Airbnb
                  orgs, to build a wide range of <Emphasize>30+ internal data products</Emphasize>
                </li>
                <li>
                  Unified Airbnb's visualization infrastructure by co-creating{' '}
                  <Link href="/projects/visx">visx</Link>, an open-source collection of low-level
                  visualization components for <code>React</code>
                </li>
              </ul>
            </p>
          </div>

          <div className="card">
            <h3>Interna – Interactive Analytics</h3>
            <div className="subtitle">Frontend engineer • 2015 - 2016 (1 year)</div>
            <p>
              Acquired by Twitter in 2020,{' '}
              <a href="https://interana.com" target="_blank" rel="noopener noreferrer">
                Interana
              </a>{' '}
              is a fast and scalable event-based analytics solution to answer critical business
              questions about how customers behave and products are used. Used by Asana, Bing,
              Microsoft Azur, Microsoft Office, Microsoft Outlook, SurveyMonkey, Uber, Salesforce,
              Comcast, Sonos, and others.
              <br />
              <br />I lead development of all visualization-related features, including exploration
              and dashboarding.
            </p>
          </div>

          <div className="card">
            <h3>Insight Data Science</h3>
            <div className="subtitle">Fellow • Aug - Nov 2015 (4 months)</div>
            <p>
              Insight is "bootcamp" program in the Bay Area to help quantitative PhD "fellows"
              transition into data science or data- roles at top tech & biotech companies. Fellows
              uplevel their skills in Python, SQL, statistics, and machine learning with a personal
              project which forms the basis of interviews at prospective companies.
            </p>
          </div>

          <div className="card">
            <h3>University of California, San Francisco</h3>
            <div className="subtitle">PhD Genomics & Cell Biology • 2010 - 2014 (4 years)</div>
            <p>
              <ul>
                <li>
                  Developed a novel genome sequencing methodology to understand spatial (3D) gene
                  expression in cells with unprecedented precision
                </li>
                <li>
                  Published <Link href="/projects/ucsf">two papers</Link> in top-tier{' '}
                  <em>Science</em> magazine applying this methodology to clarify two decades-old
                  problems in cell biology
                </li>
              </ul>
            </p>
          </div>

          <div className="card">
            <h3>Grinnell College</h3>
            <div className="subtitle">Bachelors of Science, Chemistry • 2006 - 2010 (4 years)</div>
            <p>Validictorian, 4.0 GPA</p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .about {
          position: relative;
          z-index: 1;
          height: 100%;
          max-width: 680px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }
        .about > div {
          width: 100%;
        }
        .card {
          background: white;
          border-radius: 4px;
          padding: 24px;
          margin-bottom: 32px;
          flex-direction: row;
          box-shadow: ${boxShadow};
        }
        .subtitle {
          color: ${mutedBlack};
          font-weight: 300;
        }
        li,
        .card p {
          font-size: 0.8rem;
          font-weight: 200;
        }
        li {
          list-style-type: disc;
          list-style-position: inside;
        }
        .card li {
          margin-bottom: 0.75em;
        }
      `}</style>
    </Page>
  );
}

export default AboutPage;
