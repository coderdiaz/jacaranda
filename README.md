![Discover Jacaranda](./docs/meta-jacaranda.jpg)

![NPM Version](https://img.shields.io/npm/v/jacaranda?style=flat)
![NPM License](https://img.shields.io/npm/l/jacaranda?style=flat)
![NPM Downloads](https://img.shields.io/npm/dt/jacaranda?style=flat)
![GitHub Issues](https://img.shields.io/github/issues/coderdiaz/jacaranda?style=flat)
![GitHub Stars](https://img.shields.io/github/stars/coderdiaz/jacaranda?style=flat)

> ⚠️ **BETA SOFTWARE**: This library is in active development and not yet recommended for production use. APIs may change without notice. Feel free to try it out and provide feedback!

Provides a way to styling components in React Native with better experience and composability. The key feature is the ability to create multi-variants styles with a type-safe definition inspired by [Stitches](https://stitches.dev/docs/variants) and [CVA](https://cva.style/docs/getting-started/variants) (for React apps).

## Features

- 🎨 Token-based styling system
- 🧩 Variant API for conditional styling
- 🔄 Compound variants for complex style combinations
- 🧠 Type-safe with full TypeScript support
- 🏎️ Lightweight and performant
- 🧪 Fully tested

#### Roadmap

- [x] Variants definition.
- [x] Default variants.
- [x] Support to define design tokens.
- [x] Styled function to styling component using design tokens.
- [x] Use `Stylesheet.create` instead a simple objects.
- [x] Access to `props` from styles defined into `styled` components.
- [ ] Type-safe registered tokens inside styles.
- [ ] Default design tokens.

### How to install

Add the package to your project using one of the following:

```sh
yarn add jacaranda
```

```sh
npm install jacaranda
```

```sh
npx expo install jacaranda
```

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

And returns a `sva` function that you can use to style your components.

```tsx
// jacaranda.config.ts
import { defineTokens } from 'jacaranda';

export const { sva, tokens } = defineTokens({
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

After the tokens are defined, you can use the design tokens in your components. You'll be importing the `sva` function from the `jacaranda.config.ts` file.

#### Available properties:

- `base`: The base styles for the element.
- `variants`: The different visual styles for the element.
- `compoundVariants`: Styles that apply when multiple other variant conditions are met.
- `defaultVariants`: Set a variant by default when no variant is provided.

```tsx
// Button.tsx
import { TouchableOpacity } from 'react-native';
import { type VariantProps } from 'jacaranda';
import { sva } from './jacaranda.config';

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

const buttonStyles = sva({
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

### Styled Components with Design Tokens

Jacaranda provides a `styled` function similar to `styled-components` that allows you to create styled React Native components with access to your design tokens.

#### Key features:

- Create reusable styled components from any React Native component
- Access design tokens using the `$` prefix (e.g. `$colors.primary50`)
- Supports all React Native style properties

```tsx
import { View } from 'react-native';
import { styled } from './jacaranda.config';

const StyledView = styled(View)({
  backgroundColor: '$colors.primary50',
});

export const Screen = () => {
  return <StyledView></StyledView>;
};
```

#### Access to `props` for conditional properties:

```tsx
const StyledView = styled(View)((props) => ({
  backgroundColor: '$colors.primary50',
}));
```

Copyright @ 2025 by Javier Diaz
