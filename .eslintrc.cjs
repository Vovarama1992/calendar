module.exports = {
  root: true,
  env: {
    amd: true,
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier/prettier',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    // 'plugin:perfectionist/recommended-natural', // Убрано использование perfectionist
    'plugin:boundaries/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint', 'import', 'boundaries'],
  rules: {
    'react-refresh/only-export-components': 0,
    'arrow-parens': 'off',
    'consistent-return': 'off',
    curly: ['error', 'all'],
    'import/extensions': [
      'error',
      { css: 'always', json: 'always', scss: 'always', svg: 'always' },
    ],
    'import/no-duplicates': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'max-lines': ['error', 300],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'off',
    'no-empty-pattern': 'off',
    'no-nested-ternary': 'error',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-var': 'error',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', next: 'return', prev: '*' },
      { blankLine: 'always', next: '*', prev: ['const', 'let', 'var'] },
      {
        blankLine: 'any',
        next: ['const', 'let', 'var'],
        prev: ['const', 'let', 'var'],
      },
    ],
    // Удалено правило perfectionist/sort-imports
    'prefer-const': 'error',
    'react/display-name': 'off',
    'react/jsx-boolean-value': ['error'],
    'react/jsx-curly-brace-presence': [
      'error',
      { children: 'ignore', propElementValues: 'always', props: 'always' },
    ],
    'react/jsx-fragments': ['error'],
    'react/prop-types': 'off',
    'react/void-dom-elements-no-children': ['error']
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        paths: ['src'],
      },
      typescript: {
        alwaysTryTypes: true,
      },
    },
    react: {
      version: 'detect',
    },
  },
}
