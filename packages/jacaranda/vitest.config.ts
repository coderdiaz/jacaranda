import { defineConfig } from 'vitest/config';
import reactNative from 'vitest-react-native';

export default defineConfig({
  plugins: [reactNative()],
  test: {
    globals: true,
    coverage: {
      include: ['src/**/*.ts', 'src/**/*.tsx'],
    },
  },
});
