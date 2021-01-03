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
      }
    `}</style>
  </>
);

export default ProjectImage;
