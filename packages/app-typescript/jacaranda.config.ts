import { defineTokens } from 'jacaranda';

export const { sva, tokens } = defineTokens({
  colors: {
    white: '#ffffff',
    black: '#000000',
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
  space: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
  },
});
