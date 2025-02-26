import { TouchableOpacity } from 'react-native';
import { type VariantProps } from 'jacaranda';
import { Typography } from './Typography';
import { styles } from '../jacaranda.config';

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

const buttonStyles = styles({
  base: {
    paddingHorizontal: '$spacing.8',
    paddingVertical: '$spacing.3',
    borderRadius: '$spacing.2',
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
