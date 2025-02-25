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

import { styles as baseStyles } from './index';
import type { StyleObject } from './index';

// Define allowed token categories and their value types
interface AllowedTokenCategories {
  colors: string;
  spacing: number;
  fontSizes: number;
  fonts: string;
  lineHeight: number;
  borderWidth: number;
  borderStyles: 'solid' | 'dashed' | 'dotted' | 'none';
}

// Update TokenConfig to only allow specific categories
type TokenConfig = {
  [K in keyof AllowedTokenCategories]?: Record<string, AllowedTokenCategories[K]>;
};

interface CreateTokensReturn {
  styles: typeof baseStyles;
}

// Helper to resolve token references in style objects
function resolveTokens(style: StyleObject, tokens: TokenConfig): StyleObject {
  return Object.entries(style).reduce<Record<string, any>>((acc, [key, value]) => {
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
  }, {}) as StyleObject;
}

/**
 * Creates a token system and returns the styles function
 */
export function createTokens<T extends TokenConfig>(tokenConfig: T): CreateTokensReturn {
  // Create the tokens object
  const tokens = Object.entries(tokenConfig).reduce((acc, [category, values]) => {
    return {
      ...acc,
      [category]: values,
    };
  }, {} as any);

  // Create a wrapped styles function that resolves token references
  const wrappedStyles: typeof baseStyles = (config: any) => {
    // Resolve tokens in base styles
    const resolvedBase = config.base ? resolveTokens(config.base, tokens) : config.base;

    // Resolve tokens in variants
    const resolvedVariants = config.variants ? Object.entries(config.variants).reduce((acc, [key, variantGroup]: [string, any]) => {
      const resolvedGroup = Object.entries(variantGroup).reduce((groupAcc, [variantKey, styles]: [string, any]) => {
        return {
          ...groupAcc,
          [variantKey]: resolveTokens(styles, tokens),
        };
      }, {});
      return { ...acc, [key]: resolvedGroup };
    }, {}) : {};

    // Resolve tokens in compound variants
    const resolvedCompoundVariants = config.compoundVariants?.map((compound: any) => ({
      ...compound,
      style: resolveTokens(compound.style, tokens),
    }));

    // Return the styles function with resolved tokens
    return baseStyles({
      ...config,
      base: resolvedBase,
      variants: resolvedVariants,
      compoundVariants: resolvedCompoundVariants,
    });
  };

  return {
    styles: wrappedStyles,
  };
} 