import { defineTokens } from "jacaranda";

export const { styles } = defineTokens({
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
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
})