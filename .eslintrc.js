
module.exports = {
  extends: ['expo', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'react'],
  settings: {
    'import/resolver': {
      'babel-module': {
        alias: {
          '@': '.',
        },
      },
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        paths: ['.'],
      },
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/array-type': ['error', { default: 'array' }],
    'import/no-unresolved': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/display-name': 'warn',
  },
  overrides: [
    {
      // Disable no-var-requires for config files
      files: ['*.config.js', '*.config.ts', 'babel.config.js', 'metro.config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
