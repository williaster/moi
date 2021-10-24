import { forwardRef } from 'react';
import { Text as BaseText } from '@react-three/drei';
import getStaticUrl from '../../utils/getStaticUrl';

export const Text: React.FC<{}> = forwardRef(({ children, ...props }, ref) => {
  return (
    <BaseText
      ref={ref}
      letterSpacing={-0.05}
      lineHeight={0.8}
      // font="https://fonts.gstatic.com/s/hind/v11/5aU19_a8oxmIfJpbERySiw.woff" // 500
      font="https://fonts.gstatic.com/s/hind/v11/5aU19_a8oxmIfLZcERySiw.woff" // 600
      // font="https://fonts.gstatic.com/s/hind/v11/5aU19_a8oxmIfNJdERySiw.woff" // 700
      fontSize={1}
      color="#222"
      anchorX="center"
      anchorY="middle"
      {...props}
    >
      {children}
    </BaseText>
  );
});
