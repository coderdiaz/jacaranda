import React from 'react';
import { View } from 'react-native';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react-native';
import { defineTokens } from './';

describe('sva', () => {
  it('should return base styles when no variants are provided', () => {
    const { sva } = defineTokens({});
    const baseStyles = sva({
      base: { display: 'flex' },
      variants: {},
    });

    expect(baseStyles()).toEqual({ display: 'flex' });
  });

  it('should apply variant styles correctly', () => {
    const { sva } = defineTokens({});
    const buttonStyles = sva({
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
    const { sva } = defineTokens({});
    const buttonStyles = sva({
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
    const { sva } = defineTokens({});
    const buttonStyles = sva({
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
    const { sva } = defineTokens({});
    const buttonStyles = sva({
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
    const { sva } = defineTokens({});
    const buttonStyles = sva({
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

  it('should support boolean variants', () => {
    const { sva } = defineTokens({});
    const buttonStyles = sva({
      base: { display: 'flex' },
      variants: {
        disabled: {
          true: { opacity: 0.5 },
          false: { opacity: 1 },
        },
      },
      defaultVariants: {
        disabled: false,
      },
    });

    // Test with explicit true value
    expect(buttonStyles({ disabled: true })).toEqual({
      display: 'flex',
      opacity: 0.5,
    });

    // Test with explicit false value
    expect(buttonStyles({ disabled: false })).toEqual({
      display: 'flex',
      opacity: 1,
    });

    // Test with default value
    expect(buttonStyles()).toEqual({
      display: 'flex',
      opacity: 1,
    });
  });

  it('should support compound variants with boolean values', () => {
    const { sva } = defineTokens({});
    const buttonStyles = sva({
      base: { display: 'flex' },
      variants: {
        disabled: {
          true: { opacity: 0.5 },
          false: { opacity: 1 },
        },
        size: {
          sm: { padding: 4 },
          lg: { padding: 8 },
        },
      },
      compoundVariants: [
        {
          variants: { disabled: true, size: 'lg' },
          style: { fontStyle: 'italic' },
        },
      ],
      defaultVariants: {
        disabled: false,
        size: 'sm',
      },
    });

    // Test compound variant with boolean true
    expect(buttonStyles({ disabled: true, size: 'lg' })).toEqual({
      display: 'flex',
      opacity: 0.5,
      padding: 8,
      fontStyle: 'italic',
    });

    // Test without triggering compound variant
    expect(buttonStyles({ disabled: true, size: 'sm' })).toEqual({
      display: 'flex',
      opacity: 0.5,
      padding: 4,
    });
  });
});

describe('defineTokens', () => {
  it('should create styles function', () => {
    const { sva } = defineTokens({
      colors: {
        primary: '#000000',
        secondary: '#ffffff',
      },
      space: {
        sm: 8,
        md: 16,
      },
    });

    expect(typeof sva).toBe('function');
  });

  it('should resolve token references in styles', () => {
    const { sva } = defineTokens({
      colors: {
        primary: '#000000',
      },
      space: {
        sm: 8,
      },
    });

    const result = sva({
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
    const { sva } = defineTokens({
      colors: {
        primary: '#000000',
      },
    });

    const result = sva({
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
    const { sva } = defineTokens({
      colors: {
        primary: '#000000',
      },
      space: {
        sm: 8,
      },
    });

    const result = sva({
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
    const { sva } = defineTokens({
      colors: {
        primary: '#000000',
      },
    });

    const result = sva({
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
    const { sva } = defineTokens({
      colors: { primary: '#000000' },
      space: { sm: 8 },
      fontSizes: { base: 16 },
      fonts: { body: 'Arial' },
      lineHeight: { normal: 1.5 },
    });

    const result = sva({
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

describe('styled', () => {
  it('should render a styled component', async () => {
    const { styled } = defineTokens({});
    const StyledView = styled(View)({});

    const rendered = render(React.createElement(StyledView, { testID: 'styled-view' }));
    const view = await rendered.getByTestId('styled-view');

    expect(view.props.style).toMatchObject({});
  });

  it('should use defined tokens from the styled function', async () => {
    const { styled } = defineTokens({
      colors: {
        primary: 'red',
        secondary: 'blue',
      },
      space: {
        small: 10,
        medium: 20,
        large: 30,
      },
    });

    const StyledView = styled(View)({
      backgroundColor: '$colors.primary',
      padding: '$space.small',
    });

    const rendered = render(React.createElement(StyledView, { testID: 'styled-view' }));
    const view = await rendered.getByTestId('styled-view');

    expect(view.props.style).toMatchObject({
      backgroundColor: 'red',
      padding: 10,
    });
  });

  it('should merge styles from props and tokens', async () => {
    const { styled } = defineTokens({
      colors: {
        primary: 'red',
      },
    });

    const StyledView = styled(View)({
      backgroundColor: '$colors.primary',
    });

    const rendered = render(
      React.createElement(StyledView, {
        testID: 'styled-view',
        style: { backgroundColor: 'blue' },
      }),
    );
    const view = await rendered.getByTestId('styled-view');

    expect(view.props.style).toMatchObject([
      {
        backgroundColor: 'red',
      },
      { backgroundColor: 'blue' },
    ]);
  });

  it('should ignore non defined tokens', async () => {
    const { styled } = defineTokens({});
    const StyledView = styled(View)({
      backgroundColor: '$colors.primary',
    });

    const rendered = render(
      React.createElement(StyledView, {
        testID: 'styled-view',
      }),
    );
    const view = await rendered.getByTestId('styled-view');

    expect(view.props.style).toMatchObject({});
  });
});
