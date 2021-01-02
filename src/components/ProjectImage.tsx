import React from 'react';

const ProjectImage = ({ src, imageStyles }: { src: string; imageStyles?: React.CSSProperties }) => (
  <>
    <img className="img" src={src} style={imageStyles} />
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
