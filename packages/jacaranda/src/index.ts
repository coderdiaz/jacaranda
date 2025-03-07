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
//   defaultVariants: {
//     visual: 'solid',
//     size: 'sm',
//   }
// });

import React, { type ComponentType, type ReactNode } from 'react';
import { ImageStyle, TextStyle, ViewStyle, StyleProp, StyleSheet } from 'react-native';

// Define a type that removes token strings from style properties
type ResolvedStyle = ViewStyle & TextStyle & ImageStyle;

// StyleObject now extends ResolvedStyle
type StyleObject = {
  [K in keyof ResolvedStyle]?:
    | ResolvedStyle[K]
    | (string extends ResolvedStyle[K] ? `$${string}` : never)
    | (number extends ResolvedStyle[K] ? `$${string}` : never);
};

// Define the VariantOptions type to ensure type safety in variant definitions
type VariantOptions<V> = {
  [P in keyof V]: {
    [K in keyof V[P]]: StyleObject;
  };
};

// BooleanVariantKey type for 'true' and 'false' string literals
type BooleanVariantKey = 'true' | 'false';

type CompoundVariant<V> = {
  variants: Partial<{
    [P in keyof V]: keyof V[P] | boolean;
  }>;
  style: StyleObject;
};

// DefaultVariants type
type DefaultVariants<V> = Partial<{
  [P in keyof V]: keyof V[P] | boolean;
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

export type VariantProps<T> = T extends (props?: infer P) => StyleProp<ResolvedStyle> ? P : never;

/**
 * Creates a function that generates styles based on variants
 */
function styles<V extends VariantOptions<V>>(config: VariantStyleConfig<V>) {
  type VariantProps = { [P in keyof V]: keyof V[P] | boolean | (string & {}) };
  type DefaultProps = NonNullable<typeof config.defaultVariants>;
  type Props = OptionalIfHasDefault<VariantProps, DefaultProps>;

  return (props?: Props): StyleProp<ResolvedStyle> => {
    // Start with base styles
    let stylesObj: StyleObject = {
      ...(config.base || {}),
    };

    // Merge default variants with provided props
    const mergedProps = {
      ...(config.defaultVariants || {}),
      ...props,
    } as VariantProps;

    // Apply variant styles
    for (const [propName, value] of Object.entries(mergedProps) as [
      keyof V,
      keyof VariantProps[keyof V] | boolean,
    ][]) {
      const variantGroup = config.variants[propName];
      if (variantGroup) {
        // Handle boolean variants
        if (typeof value === 'boolean') {
          const booleanValue: BooleanVariantKey = value ? 'true' : 'false';
          if (variantGroup[booleanValue as keyof typeof variantGroup]) {
            stylesObj = {
              ...stylesObj,
              ...variantGroup[booleanValue as keyof typeof variantGroup],
            };
          }
        } else {
          // Handle string/enum variants
          const variantValue = value || config.defaultVariants?.[propName];
          if (variantValue && variantGroup[variantValue as keyof typeof variantGroup]) {
            stylesObj = {
              ...stylesObj,
              ...variantGroup[variantValue as keyof typeof variantGroup],
            };
          }
        }
      }
    }

    // Apply compound variants
    if (config.compoundVariants) {
      for (const compound of config.compoundVariants) {
        if (
          Object.entries(compound.variants).every(([propName, value]) => {
            // Handle boolean values in compound variants
            if (typeof value === 'boolean') {
              return mergedProps[propName as keyof V] === value;
            }
            return mergedProps[propName as keyof V] === value;
          })
        ) {
          stylesObj = {
            ...stylesObj,
            ...compound.style,
          };
        }
      }
    }

    // Create a StyleSheet for better performance
    return StyleSheet.create({
      style: stylesObj as ResolvedStyle,
    }).style;
  };
}

/**** Tokens definition */

// Define allowed token categories and their value types
interface AllowedTokenCategories {
  colors: string;
  space: number;
  fontSize: number;
  fonts: string;
  lineHeight: number;
}

// Update TokenConfig to only allow specific categories
type TokenConfig = {
  [K in keyof AllowedTokenCategories]?: Record<string, AllowedTokenCategories[K]>;
};

// Helper type to extract component props
type ComponentProps<T> = T extends ComponentType<infer P> ? P : never;

type StyledFunction = <C extends ComponentType<any>>(
  Component: C,
) => <P extends object = {}>(
  styleObject: StyleObject,
) => ComponentType<
  P & Omit<ComponentProps<C>, 'style'> & { style?: StyleProp<ViewStyle | TextStyle | ImageStyle> }
>;

interface CreateTokensReturn {
  sva: typeof styles;
  tokens: TokenConfig;
  styled: StyledFunction;
}

// Helper to resolve token references in style objects
function resolveTokens(style: StyleObject, tokens: TokenConfig): StyleObject {
  return Object.entries(style).reduce<Record<string, ResolvedStyle[keyof ResolvedStyle]>>(
    (acc, [key, value]) => {
      if (typeof value !== 'string' || !value.startsWith('$')) {
        acc[key] = value;
        return acc;
      }

      const tokenPath = value.slice(1).split('.');
      const [category, token] = tokenPath;

      const tokenValue = tokens[category as keyof TokenConfig]?.[token];
      if (tokenValue !== undefined) {
        acc[key] = tokenValue;
      }

      return acc;
    },
    {},
  ) as StyleObject;
}

/**
 * Creates a token system and returns the styles function
 */
export function defineTokens<T extends TokenConfig>(tokenConfig: T): CreateTokensReturn {
  // Create the tokens object
  const tokens = Object.entries(tokenConfig).reduce((acc, [category, values]) => {
    return {
      ...acc,
      [category]: values,
    };
  }, {} as TokenConfig);

  // Create a wrapped styles function that resolves token references
  const sva: typeof styles = <V extends VariantOptions<V>>(config: VariantStyleConfig<V>) => {
    // Resolve tokens in base styles
    const resolvedBase = config.base ? resolveTokens(config.base, tokens) : config.base;

    // Resolve tokens in variants
    const resolvedVariants = config.variants
      ? (Object.entries(config.variants).reduce<Partial<V>>((acc, [key, variantGroup]) => {
          type VariantGroupType = Record<string, StyleObject>;

          const resolvedGroup = Object.entries(variantGroup as VariantGroupType).reduce<
            Record<string, StyleObject>
          >((groupAcc, [variantKey, variantStyles]) => {
            return {
              ...groupAcc,
              [variantKey]: resolveTokens(variantStyles, tokens),
            };
          }, {});

          return {
            ...acc,
            [key as keyof V]: resolvedGroup as V[keyof V],
          };
        }, {}) as V)
      : ({} as V);

    // Resolve tokens in compound variants
    const resolvedCompoundVariants = config.compoundVariants?.map((compound) => ({
      ...compound,
      style: resolveTokens(compound.style, tokens),
    }));

    // Return the styles function with resolved tokens
    return styles({
      ...config,
      base: resolvedBase,
      variants: resolvedVariants,
      compoundVariants: resolvedCompoundVariants,
    });
  };

  /**
   * Styled function for creating styled components with token-aware styles
   */
  const styled: StyledFunction = <C extends ComponentType<any>>(Component: C) => {
    return <P extends object = {}>(styleObject: StyleObject) => {
      // Resolve tokens in the style object
      const resolvedStyle = resolveTokens(styleObject, tokens);

      // Create StyleSheet using StyleSheet.create for better performance
      const styles = StyleSheet.create({
        style: resolvedStyle as ResolvedStyle,
      });

      // Create and return a new component that applies the resolved styles
      const StyledComponent: ComponentType<
        P &
          Omit<ComponentProps<C>, 'style'> & {
            style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
          }
      > = (props) => {
        const {
          children,
          style: propStyle,
          ...rest
        } = props as {
          children?: ReactNode;
          style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
        } & Record<string, unknown>;

        // Merge the StyleSheet style with any style passed in props
        const mergedStyle = propStyle
          ? Array.isArray(propStyle)
            ? [styles.style, ...propStyle]
            : [styles.style, propStyle]
          : styles.style;

        // We need to cast here to handle the component props correctly
        const componentProps = {
          ...rest,
          style: mergedStyle,
        } as ComponentProps<C>;

        // Use createElement instead of JSX to avoid syntax issues
        return React.createElement(Component, componentProps, children);
      };

      // Set display name for better debugging
      const componentName = Component.displayName || Component.name || 'Component';
      StyledComponent.displayName = `Styled(${componentName})`;

      return StyledComponent;
    };
  };

  return {
    sva,
    tokens,
    styled,
  };
}
