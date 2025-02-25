import { describe, it, expect } from 'vitest';
import { createTokens } from './tokens';

describe('createTokens', () => {
  it('should create styles function', () => {
    const { styles } = createTokens({
      colors: {
        primary: '#000000',
        secondary: '#ffffff',
      },
      spacing: {
        sm: 8,
        md: 16,
      },
    });

    expect(typeof styles).toBe('function');
  });

  it('should resolve token references in styles', () => {
    const { styles } = createTokens({
      colors: {
        primary: '#000000',
      },
      spacing: {
        sm: 8,
      },
    });

    const result = styles({
      base: {
        backgroundColor: '$colors.primary',
        padding: '$spacing.sm',
      },
      variants: {},
    });

    expect(result()).toEqual({
      backgroundColor: '#000000',
      padding: 8,
    });
  });

  it('should resolve token references in variants', () => {
    const { styles } = createTokens({
      colors: {
        primary: '#000000',
      },
      borderStyles: {
        default: 'solid',
      },
    });

    const result = styles({
      base: {},
      variants: {
        type: {
          primary: {
            backgroundColor: '$colors.primary',
            borderStyle: '$borderStyles.default',
          },
        },
      },
    });

    expect(result({ type: 'primary' })).toEqual({
      backgroundColor: '#000000',
      borderStyle: 'solid',
    });
  });

  it('should handle compound variants', () => {
    const { styles } = createTokens({
      colors: {
        primary: '#000000',
      },
      spacing: {
        sm: 8,
      },
    });

    const result = styles({
      base: {},
      variants: {
        size: { small: {} },
        type: { primary: {} },
      },
      compoundVariants: [{
        variants: { size: 'small' as const, type: 'primary' as const },
        style: {
          backgroundColor: '$colors.primary',
          padding: '$spacing.sm',
        },
      }],
    });

    expect(result({ size: 'small', type: 'primary' })).toEqual({
      backgroundColor: '#000000',
      padding: 8,
    });
  });

  it('should ignore missing token references', () => {
    const { styles } = createTokens({
      colors: {
        primary: '#000000',
      },
    });

    const result = styles({
      base: {
        backgroundColor: '$colors.nonexistent',
        color: '$colors.primary',
      },
      variants: {},
    });

    expect(result()).toEqual({
      color: '#000000',
    });
  });

  it('should support all allowed token categories', () => {
    const { styles } = createTokens({
      colors: { primary: '#000000' },
      spacing: { sm: 8 },
      fontSizes: { base: 16 },
      fonts: { body: 'Arial' },
      lineHeight: { normal: 1.5 },
      borderWidth: { thin: 1 },
      borderStyles: { default: 'solid' },
    });

    const result = styles({
      base: {
        color: '$colors.primary',
        padding: '$spacing.sm',
        fontSize: '$fontSizes.base',
        fontFamily: '$fonts.body',
        lineHeight: '$lineHeight.normal',
        borderWidth: '$borderWidth.thin',
        borderStyle: '$borderStyles.default',
      },
      variants: {},
    });

    expect(result()).toEqual({
      color: '#000000',
      padding: 8,
      fontSize: 16,
      fontFamily: 'Arial',
      lineHeight: 1.5,
      borderWidth: 1,
      borderStyle: 'solid',
    });
  });
}); 