## Jacaranda

> ⚠️ **BETA SOFTWARE**: This library is in active development and not yet recommended for production use. APIs may change without notice. Feel free to try it out and provide feedback!

Provides a way to styling components in React Native with better experience and composability. The key feature is the ability to create multi-variants styles with a type-safe definition inspired by [Stitches](https://stitches.dev/docs/variants) and [CVA](https://cva.style/docs/getting-started/variants) (for React apps).

#### Currently properties:

- `base`: The base styles for the element.
- `variants`: The different visual styles for the element.
- `compoundVariants`: Styles that apply when multiple other variant conditions are met.
- `default`: Set a variant by default.

#### Roadmap

- [x] Variants definition.
- [x] Default variants.
- [x] Support to define theme tokens.
- [ ] Styles based on conditions.

### Example of usage

```tsx jacaranda.ts
import { createTokens } from 'jacaranda';

export const { styles } = createTokens({
  colors: {
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
  fontSize: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
})
```

```tsx
import { styles } from './jacaranda';

// Button primitive
export const Button = () => {
  return (
    <TouchableOpacity style={buttonStyles()}>
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
  default: {
    intent: 'primary',
    size: 'md',
  },
});
```

Copyright @ 2025 by Javier Diaz
