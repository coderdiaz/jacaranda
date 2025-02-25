import { Text } from 'react-native';
import { VariantProps } from 'jacaranda';
import { styles } from '../jacaranda.config';

type TypographyProps = VariantProps<typeof typographyStyles> & {
  children?: React.ReactNode;
};

export const Typography = (props: TypographyProps) => {
  return <Text style={typographyStyles(props)}>{props.children}</Text>
}

const typographyStyles = styles({
  base: {},
  variants: {
    color: {
      white: { color: '$colors.white' },
      black: { color: '$colors.black' },
    },
    level: {
      1: { fontSize: 24 },
      2: { fontSize: 20 },
      3: { fontSize: 16 },
      4: { fontSize: 14 },
      5: { fontSize: 12 },
    },
    weight: {
      regular: { fontWeight: 'normal' },
      medium: { fontWeight: 'medium' },
      semibold: { fontWeight: 'semibold' },
      bold: { fontWeight: 'bold' },
    },
    align: {
      left: { textAlign: 'left' },
      center: { textAlign: 'center' },
      right: { textAlign: 'right' },
    }
  },
  defaultVariants: {
    level: 3,
    color: 'white',
    weight: 'medium',
    align: 'left'
  }
})