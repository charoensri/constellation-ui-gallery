import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  core: {
    disableTelemetry: true
  },
  framework: '@storybook/react-webpack5',
  staticDirs: ['./static'],
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  docs: {
    autodocs: true
  }
};

export default config;
