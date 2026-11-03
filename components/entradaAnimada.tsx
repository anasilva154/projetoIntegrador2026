import type { ComponentProps } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

type Props = ComponentProps<typeof View> & {
  staggerIndex?: number;
};

export function ContainerAnimado({ staggerIndex = 0, ...props }: Props) {
  return (
    <AnimatedView
      entering={FadeInDown.delay(staggerIndex * 140).duration(450)}
      {...props}
    />
  );
}
