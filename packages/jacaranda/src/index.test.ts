import { describe, it, expect } from 'vitest';
import { styles, defineTokens } from './';

describe('styles', () => {
  it('should return base styles when no variants are provided', () => {
    const baseStyles = styles({
      base: { display: 'flex' },
      variants: {},
    });

    expect(baseStyles()).toEqual({ display: 'flex' });
  });

  it('should apply variant styles correctly', () => {
    const buttonStyles = styles({
      base: { display: 'flex' },
      variants: {
        visual: {
          solid: { backgroundColor: '#FC8181', color: 'white' },
          outline: { borderWidth: 1, borderColor: '#FC8181' },
        },
        size: {
          sm: { padding: 4, fontSize: 12 },
          lg: { padding: 8, fontSize: 24 },
        },
      },
    });

    expect(buttonStyles({ visual: 'solid', size: 'sm' })).toEqual({
      display: 'flex',
      backgroundColor: '#FC8181',
      color: 'white',
      padding: 4,
      fontSize: 12,
    });
  });

  it('should apply default variants when props are not provided', () => {
    const buttonStyles = styles({
      base: { display: 'flex' },
      variants: {
        visual: {
          solid: { backgroundColor: '#FC8181' },
          outline: { borderWidth: 1 },
        },
      },
      defaultVariants: {
        visual: 'solid',
      },
    });

    expect(buttonStyles()).toEqual({
      display: 'flex',
      backgroundColor: '#FC8181',
    });
  });

  it('should apply compound variants correctly', () => {
    const buttonStyles = styles({
      base: { display: 'flex' },
      variants: {
        visual: {
          solid: { backgroundColor: '#FC8181' },
          outline: { borderWidth: 1 },
        },
        size: {
          sm: { padding: 4 },
          lg: { padding: 8 },
        },
      },
      compoundVariants: [
        {
          variants: { visual: 'solid', size: 'lg' },
          style: { fontWeight: 'bold' },
        },
      ],
    });

    expect(buttonStyles({ visual: 'solid', size: 'lg' })).toEqual({
      display: 'flex',
      backgroundColor: '#FC8181',
      padding: 8,
      fontWeight: 'bold',
    });
  });

  it('should override default variants with provided props', () => {
    const buttonStyles = styles({
      base: { display: 'flex' },
      variants: {
        visual: {
          solid: { backgroundColor: '#FC8181' },
          outline: { borderWidth: 1 },
        },
      },
      defaultVariants: {
        visual: 'solid',
      },
    });

    expect(buttonStyles({ visual: 'outline' })).toEqual({
      display: 'flex',
      borderWidth: 1,
    });
  });

  it('should handle invalid variant values gracefully', () => {
    const buttonStyles = styles({
      base: { display: 'flex' },
      variants: {
        visual: {
          solid: { backgroundColor: '#FC8181' },
          outline: { borderWidth: 1 },
        },
      },
    });

    expect(buttonStyles({ visual: 'nonexistent' })).toEqual({
      display: 'flex',
    });
  });
});

describe('defineTokens', () => {
  it('should create styles function', () => {
    const { styles } = defineTokens({
      colors: {
        primary: '#000000',
        secondary: '#ffffff',
      },
      space: {
        sm: 8,
        md: 16,
      },
    });

    expect(typeof styles).toBe('function');
  });

  it('should resolve token references in styles', () => {
    const { styles } = defineTokens({
      colors: {
        primary: '#000000',
      },
      space: {
        sm: 8,
      },
    });

    const result = styles({
      base: {
        backgroundColor: '$colors.primary',
        padding: '$space.sm',
      },
      variants: {},
    });

    expect(result()).toEqual({
      backgroundColor: '#000000',
      padding: 8,
    });
  });

  it('should resolve token references in variants', () => {
    const { styles } = defineTokens({
      colors: {
        primary: '#000000',
      },
    });

    const result = styles({
      base: {},
      variants: {
        type: {
          primary: {
            backgroundColor: '$colors.primary',
          },
        },
      },
    });

    expect(result({ type: 'primary' })).toEqual({
      backgroundColor: '#000000',
    });
  });

  it('should handle compound variants', () => {
    const { styles } = defineTokens({
      colors: {
        primary: '#000000',
      },
      space: {
        sm: 8,
      },
    });

    const result = styles({
      base: {},
      variants: {
        size: { small: {} },
        type: { primary: {} },
      },
      compoundVariants: [
        {
          variants: { size: 'small' as const, type: 'primary' as const },
          style: {
            backgroundColor: '$colors.primary',
            padding: '$space.sm',
          },
        },
      ],
    });

    expect(result({ size: 'small', type: 'primary' })).toEqual({
      backgroundColor: '#000000',
      padding: 8,
    });
  });

  it('should ignore missing token references', () => {
    const { styles } = defineTokens({
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
    const { styles } = defineTokens({
      colors: { primary: '#000000' },
      space: { sm: 8 },
      fontSizes: { base: 16 },
      fonts: { body: 'Arial' },
      lineHeight: { normal: 1.5 },
    });

    const result = styles({
      base: {
        color: '$colors.primary',
        padding: '$space.sm',
        fontSize: '$fontSizes.base',
        fontFamily: '$fonts.body',
        lineHeight: '$lineHeight.normal',
      },
      variants: {},
    });

    expect(result()).toEqual({
      color: '#000000',
      padding: 8,
      fontSize: 16,
      fontFamily: 'Arial',
      lineHeight: 1.5,
    });
  });
});
