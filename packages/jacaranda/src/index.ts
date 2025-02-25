/**
 * ISC License
 * Copyright 2025 Javier Diaz Chamorro
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby
 * granted, provided that the above copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING
 * ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL,
 * DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
 * WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE
 * OR PERFORMANCE OF THIS SOFTWARE.
 */

// Example of usage:
// const buttonStyles = style({
//   base: {
//     display: 'flex',
//   },
//   variants: {
//     visual: {
//       solid: { backgroundColor: '#FC8181', color: 'white' },
//       outline: { borderWidth: 1, borderColor: '#FC8181' },
//     },
//     size: {
//       sm: { padding: 4, fontSize: 12 },
//       lg: { padding: 8, fontSize: 24 },
//     },
//   },
//   // Optional: Add compound variants for specific combinations
//   compoundVariants: [
//     {
//       variants: { visual: 'solid', size: 'lg' },
//       style: { fontWeight: 'bold' },
//     },
//   ],
//   default: {
//     visual: 'solid',
//     size: 'sm',
//   }
// });

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

// Types for variant styles
type StyleObject = ViewStyle | TextStyle | ImageStyle;

// Define the VariantOptions type to ensure type safety in variant definitions
type VariantOptions<V> = {
  [P in keyof V]: {
    [K in keyof V[P]]: StyleObject;
  };
};

type CompoundVariant<V> = {
  variants: Partial<{
    [P in keyof V]: keyof V[P];
  }>;
  style: StyleObject;
};

// DefaultVariants type
type DefaultVariants<V> = Partial<{
  [P in keyof V]: keyof V[P];
}>;

// VariantStyleConfig type
type VariantStyleConfig<V extends VariantOptions<V>> = {
  base?: StyleObject;
  variants: V;
  compoundVariants?: CompoundVariant<V>[];
  defaultVariants?: DefaultVariants<V>;
};

export type OmitUndefined<T> = T extends undefined ? never : T;

/**
 * Helper type to make all properties optional if they have a default value
 */
type OptionalIfHasDefault<Props, Defaults> = Omit<Props, keyof Defaults> &
  Partial<Pick<Props, Extract<keyof Defaults, keyof Props>>>;

export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  'style'
>;

/**
 * Creates a function that generates styles based on variants
 */
export function styles<V extends VariantOptions<V>>(config: VariantStyleConfig<V>) {
  type VariantProps = { [P in keyof V]: keyof V[P] | (string & {}) };
  type DefaultProps = NonNullable<typeof config.defaultVariants>;
  type Props = OptionalIfHasDefault<VariantProps, DefaultProps>;

  return (props?: Props) => {
    // Start with base styles
    let styles: StyleObject = {
      ...(config.base || {}),
    };

    // Merge default variants with provided props
    const mergedProps = {
      ...(config.defaultVariants || {}),
      ...props,
    } as VariantProps;

    // Apply variant styles
    for (const [propName, value] of Object.entries(mergedProps) as [keyof V, any][]) {
      const variantGroup = config.variants[propName];
      if (variantGroup) {
        const variantValue = value || config.defaultVariants?.[propName];
        if (variantValue && variantGroup[variantValue as keyof typeof variantGroup]) {
          styles = {
            ...styles,
            ...variantGroup[variantValue as keyof typeof variantGroup],
          };
        }
      }
    }

    // Apply compound variants
    if (config.compoundVariants) {
      for (const compound of config.compoundVariants) {
        if (
          Object.entries(compound.variants).every(
            ([propName, value]: [string, unknown]) => mergedProps[propName as keyof V] === value,
          )
        ) {
          styles = {
            ...styles,
            ...compound.style,
          };
        }
      }
    }

    return styles;
  };
}
