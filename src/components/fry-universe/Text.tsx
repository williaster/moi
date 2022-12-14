import { forwardRef } from 'react';
import { Text as BaseText } from '@react-three/drei';
import { threeFontProps } from './font';

const Text = forwardRef(
  ({ children, ...props }: Partial<React.ComponentProps<typeof BaseText>>, ref) => (
    // @ts-expect-error
    <BaseText {...threeFontProps} {...props} ref={ref}>
      {children}
    </BaseText>
  ),
);

export default Text;
