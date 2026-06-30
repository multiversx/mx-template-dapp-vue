import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import pluginImportX from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import {
  defineConfigWithVueTs,
  vueTsConfigs
} from '@vue/eslint-config-typescript';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue,js}']
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '*.local']
  },

  js.configs.recommended,
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  {
    name: 'app/import-rules',
    plugins: { 'import-x': pluginImportX },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
        })
      ]
    },
    rules: {
      'import-x/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal'],
          'newlines-between': 'ignore',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ]
    }
  },

  // Disables formatting rules that conflict with Prettier and runs
  // Prettier as an ESLint rule (preserves the legacy .eslintrc behavior).
  prettierRecommended,

  {
    name: 'app/custom-rules',
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'lf', singleQuote: true }],

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'warn',

      // This is a component-library-style template with intentional
      // single-word component names (Button, Card, Header, ...).
      'vue/multi-word-component-names': 'off',

      // Semantic Vue rules (kept). Template/layout formatting is owned by
      // Prettier, so the previous vue/html-self-closing and
      // vue/max-attributes-per-line overrides are intentionally dropped to
      // avoid fighting Prettier (they caused circular autofixes).
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/v-on-event-hyphenation': ['error', 'always'],
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/no-v-html': 'off'
    }
  }
);
