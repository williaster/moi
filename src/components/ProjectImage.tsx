import React from 'react';
import getStaticUrl from '../utils/getStaticUrl';

const ProjectImage = ({ src, imageStyles }: { src: string; imageStyles?: React.CSSProperties }) => (
  <>
    <img className="img" src={getStaticUrl(src)} style={imageStyles} />
    <style jsx>{`
      .img {
        width: 100%;
        height: auto;
        min-width: 200px;
        display: block;
        margin: 0 auto;
      }
      img:not(:last-child)::after {
        content: '""';
        margin-right: 8px;
        margin-bottom: 8px;
      }
    `}</style>
  </>
);

export default ProjectImage;
