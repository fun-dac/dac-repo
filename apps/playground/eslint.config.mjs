import baseConfig from '@repo/eslint-config/base';
import nextConfig from '@repo/eslint-config/next';
import reactConfig from '@repo/eslint-config/react';

const config = [...baseConfig, ...nextConfig, ...reactConfig];

export default config;
