import baseConfig from '@repo/eslint-config/base';
import nextConfig from '@repo/eslint-config/next';
import reactConfig from '@repo/eslint-config/react';
import { globalIgnores } from 'eslint/config';

const config = [
  ...baseConfig,
  ...nextConfig,
  ...reactConfig,
  globalIgnores(['.source/**']),
];

export default config;
