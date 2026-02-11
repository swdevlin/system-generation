import globals from 'globals';
import prettier from 'eslint-config-prettier';
import n from 'eslint-plugin-n';
import promise from 'eslint-plugin-promise';

export default [
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'eslint.config.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node, // <-- this should be node, not "n"
    },
    plugins: {
      n,
      promise,
    },
    rules: {
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-return-await': 'error',

      'promise/catch-or-return': 'error',
      'promise/no-nesting': 'warn',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',

      'n/no-missing-require': 'error',
      'n/no-extraneous-require': 'error',
      'n/no-unpublished-require': 'off',
      'n/no-unsupported-features/es-syntax': 'off',

      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },

  {
    files: ['test/**/*.js', 'test/**/*.mjs', '**/*.test.*', '**/*.spec.*'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  },

  prettier,
];
