import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { sva } from './jacaranda.config';

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

export default function App() {
  return (
    <View style={sty.container}>
      <Button intent="primary" />
    </View>
  );
}

const sty = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
