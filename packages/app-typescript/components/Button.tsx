import { TouchableOpacity, View } from 'react-native';
import { type VariantProps } from 'jacaranda';
import { Typography } from './Typography';
import { sva, styled } from '../jacaranda.config';

type ButtonProps = VariantProps<typeof buttonStyles> & {
  children?: React.ReactNode;
};

export const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity style={buttonStyles(props)}>
      <Typography>{props.children}</Typography>
    </TouchableOpacity>
  );
};

const buttonStyles = sva({
  base: {
    paddingHorizontal: '$space.8',
    paddingVertical: '$space.3',
    borderRadius: '$space.2',
  },
  variants: {
    color: {
      primary: {
        backgroundColor: '$colors.primary500',
      },
      secondary: {
        backgroundColor: '$colors.secondary500',
      },
    },
  },
  defaultVariants: {
    color: 'primary',
  },
});
