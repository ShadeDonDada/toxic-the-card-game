
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
    'import/no-unresolved': 'off', // Turn off since we're using path aliases
    'react-hooks/exhaustive-deps': 'warn',
  },
};
