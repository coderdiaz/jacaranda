## SVA

SVA (Style Variant API) provides a way to define styles in React Native with better experience and composability. The key featuare is the ability to create multi-variants styles with a type-safe definition inspired by [Stitches](https://stitches.dev/docs/variants) and [CVA](https://cva.style/docs/getting-started/variants) (for React apps)

#### Currently properties:

- `base`: The base styles for the element.
- `variants`: The different visual styles for the element.
- `compoundVariants`: Styles that apply when multiple other variant conditions are met.
- `default`: Set a variant by default.

#### Roadmap

- [x] Variants definition.
- [x] Default variants.
- [ ] Styles based on conditions.
- [ ] Support to define theme tokens.

### Example of usage

```tsx
import { styles } from 'sva';

// With React Native screens
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
        backgroundColor: '#32275F',
      },
      secondary: {
        backgroundColor: '#D9D9D9',
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
