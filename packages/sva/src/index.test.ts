import { describe, it, expect } from 'vitest';
import { styles } from './';

describe('createVariantStyle', () => {
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
