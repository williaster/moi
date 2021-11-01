import { forwardRef } from 'react';
import { Text as BaseText } from '@react-three/drei';
import { threeFontProps } from './font';

export const Text = forwardRef(
  ({ children, ...props }: Partial<React.ComponentProps<typeof BaseText>>, ref) => (
    <BaseText {...threeFontProps} {...props} ref={ref}>
      {children}
    </BaseText>
  ),
);
