/* eslint-env node */

const { node: restrictedImports } = require('@uniswap/eslint-config/restrictedImports')
require('@uniswap/eslint-config/load')

const rulesDirPlugin = require('eslint-plugin-rulesdir')
rulesDirPlugin.RULES_DIR = 'eslint_rules'

module.exports = {
  extends: ['@uniswap/eslint-config/react'],
  plugins: ['rulesdir'],
  overrides: [
    {
      files: ['**/*'],
      rules: {
        'multiline-comment-style': ['error', 'separate-lines'],
        'prettier/prettier': ['off', { singleQuote: true }],
        'rulesdir/no-undefined-or': 'error',
        "import/no-unresolved": 0,
        "no-console": ["warn", { "allow": ["info", "warn", "error", "debug", "log"] }],
      },
    },
    {
      // Configuration/typings typically export objects/definitions that are used outside of the transpiled package
      // (eg not captured by the tsconfig). Because it's typical and not exceptional, this is turned off entirely.
      files: ['**/*.config.*', '**/*.d.ts'],
      rules: {
        'import/no-unused-modules': 'off',
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/no-restricted-imports': ['error', restrictedImports],
        'prettier/prettier': ['off', { singleQuote: true }],
        "import/no-unresolved": 0,
        "no-console": ["warn", { "allow": ["info", "warn", "error", "debug", "log"] }],
        'import/no-unused-modules': 'off',
        'import/no-restricted-paths': [
          'error',
          {
            zones: [
              {
                target: ['src/**/*[!.test].ts', 'src/**/*[!.test].tsx'],
                from: 'src/test-utils',
              },
            ],
          },
        ],
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'moment',
                // tree-shaking for moment is not configured because it degrades performance - see craco.config.cjs.
                message: 'moment is not configured for tree-shaking. If you use it, update the Webpack configuration.',
              },
              {
                name: 'zustand',
                importNames: ['default'],
                message: 'Default import from zustand is deprecated. Import `{ create }` instead.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      excludedFiles: ['src/analytics/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '@uniswap/analytics',
                message: `Do not import from '@uniswap/analytics' directly. Use 'analytics' instead.`,
              },
            ],
          },
        ],
        'prettier/prettier': ['off', { singleQuote: true }],
        "import/no-unresolved": 0,
        "no-console": ["warn", { "allow": ["info", "warn", "error", "debug", "log"] }],
      },
    },
  ],
}
