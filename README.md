## 🌸 Jacaranda

![NPM Version](https://img.shields.io/npm/v/jacaranda?style=flat)
![NPM License](https://img.shields.io/npm/l/jacaranda?style=flat)
![NPM Downloads](https://img.shields.io/npm/dt/jacaranda?style=flat)
![GitHub Issues](https://img.shields.io/github/issues/coderdiaz/jacaranda?style=flat)
![GitHub Stars](https://img.shields.io/github/stars/coderdiaz/jacaranda?style=flat)

> ⚠️ **BETA SOFTWARE**: This library is in active development and not yet recommended for production use. APIs may change without notice. Feel free to try it out and provide feedback!

Provides a way to styling components in React Native with better experience and composability. The key feature is the ability to create multi-variants styles with a type-safe definition inspired by [Stitches](https://stitches.dev/docs/variants) and [CVA](https://cva.style/docs/getting-started/variants) (for React apps).

#### Available properties:

- `base`: The base styles for the element.
- `variants`: The different visual styles for the element.
- `compoundVariants`: Styles that apply when multiple other variant conditions are met.
- `defaultVariants`: Set a variant by default when no variant is provided.

#### Roadmap

- [x] Variants definition.
- [x] Default variants.
- [x] Support to define design tokens.
- [ ] Default design tokens.

### Create your config file

To configure `Jacaranda`, create a `jacaranda.config.ts` file (`.js` works too) to define your reusable design tokens and import the `defineTokens` function.

```tsx
// jacaranda.config.ts
import { defineTokens } from 'jacaranda';
```

This function receives an object with the design tokens.

- `colors`: Define your colors design tokens.
- `space`: Define your spacing.
- `fonts`: Define your fonts.
- `fontSize`: Define your font sizes.
- `lineHeight`: Define your line heights.

And returns a `styles` function that you can use to style your components.

```tsx
// jacaranda.config.ts
import { defineTokens } from 'jacaranda';

export const { styles } = defineTokens({
  colors: {
    primary50: '#ecfeff',
    primary100: '#cffafe',
    primary200: '#a5f3fc',
    primary300: '#67e8f9',
    primary400: '#22d3ee',
    primary500: '#06b6d4',
    primary600: '#0e93d1',
    primary700: '#1570ad',
    secondary50: '#ecfdf5',
    secondary100: '#d9f9eb',
    secondary200: '#bbfde8',
    secondary300: '#86f9d9',
    secondary400: '#0d9488',
    secondary500: '#027a7b',
    secondary600: '#016464',
    secondary700: '#014747',
  },
  fontSize: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
});
```

### Import and use it

After the tokens are defined, you can use the design tokens in your components. You'll be importing the `styles` function from the `jacaranda.config.ts` file.

```tsx
// Button.tsx
import { TouchableOpacity } from 'react-native';
import { type VariantProps } from 'jacaranda';
import { styles } from './jacaranda.config';

type ButtonProps = VariantProps<typeof buttonStyles> & {
  children?: React.ReactNode;
};

export const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity style={buttonStyles(props)}>
      <Text>Click me</Text>
    </TouchableOpacity>
  );
};

const buttonStyles = styles({
  base: {
    borderRadius: 8,
  },
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
      sm: { paddingHorizontal: 8, paddingVertical: 6 },
      md: { paddingHorizontal: 12, paddingVertical: 8 },
      lg: { paddingHorizontal: 16, paddingVertical: 10 },
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
});
```

### TypeScript

#### Extract variants from a component

You can use the `VariantProps` type to extract the variants from a component.

```tsx
import { type VariantProps } from 'jacaranda';

type ButtonProps = VariantProps<typeof buttonStyles>;
```

Copyright @ 2025 by Javier Diaz
