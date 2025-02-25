import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createTokens, type VariantProps } from 'jacaranda'

const { styles } = createTokens({
  colors: {
    white: '#ffffff',
    black: '#000000',
    primary50: '#ecfeff',
    primary100: '#cffafe',
    primary200: '#a5f3fc',
    primary300: '#67e8f9',
    primary400: '#22d3ee',
    primary500: '#06b6d4',
    primary600: '#0e93d1',
    primary700: '#1570ad',
    // Secondary
    secondary50: '#ecfdf5',
    secondary100: '#d9f9eb',
    secondary200: '#bbfde8',
    secondary300: '#86f9d9',
    secondary400: '#0d9488',
    secondary500: '#027a7b',
    secondary600: '#016464',
    secondary700: '#014747',
  },
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
  }
})

type ButtonProps = VariantProps<typeof buttonStyles> & {
  children?: React.ReactNode;
};

const Button = (props: ButtonProps) => {
  return <TouchableOpacity style={buttonStyles(props)}>
    <Text>{props.children}</Text>
  </TouchableOpacity>
}

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
    }
  },
  defaultVariants: {
    color: 'primary'
  }
})

type TypographyProps = VariantProps<typeof typographyStyles> & {
  children?: React.ReactNode;
};

const Typography = (props: TypographyProps) => {
  return <Text style={typographyStyles(props)}>{props.children}</Text>
}

const typographyStyles = styles({
  base: {},
  variants: {
    color: {
      white: { color: '$colors.white' },
      black: { color: '$colors.black' },
    },
    size: {
      sm: { fontSize: 10 },
      md: { fontSize: 16 },
      lg: { fontSize: 24 },
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'white'
  }
})

export default function App() {
  return (
    <View style={sty.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button color="secondary">
        <Typography color="white">Hello</Typography>
      </Button>
      <Button color="primary">
        <Typography color="black">Hello</Typography>
      </Button>
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
