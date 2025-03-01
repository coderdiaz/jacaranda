import { Text, TouchableOpacity, View } from 'react-native';
import { sva, styled } from './jacaranda.config';

export const Button = (props) => {
  return (
    <TouchableOpacity style={buttonStyles({ intent: props.intent, size: props.size })}>
      <Text>Button</Text>
    </TouchableOpacity>
  );
};

const buttonStyles = sva({
  base: { borderRadius: '$space.md' },
  variants: {
    intent: {
      primary: {
        backgroundColor: '$colors.primary50',
      },
      secondary: {
        backgroundColor: '$colors.secondary50',
      },
    },
    size: {
      md: {
        paddingHorizontal: '$space.md',
        paddingVertical: '$space.sm',
      },
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
});

const StyledView = styled(View)({
  flex: 1,
  backgroundColor: '$colors.white',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$space.3',
});

export default function App() {
  return (
    <StyledView>
      <Button intent="primary" />
    </StyledView>
  );
}
