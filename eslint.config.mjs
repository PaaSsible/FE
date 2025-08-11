// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config(
  [
    globalIgnores(['dist']),
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        js.configs.recommended,
        tseslint.configs.recommended,
        reactHooks.configs['recommended-latest'],
        reactRefresh.configs.vite,
      ],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      rules: {
        // TypeScript 규칙
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-empty-function': ['error'],
        '@typescript-eslint/no-require-imports': ['error', { allow: ['~/asset/*'] }],
        '@typescript-eslint/no-unused-expressions': [
          'error',
          { allowShortCircuit: true, allowTernary: true },
        ],
        '@typescript-eslint/no-unused-vars': 'warn',

        // import 관련 규칙
        'import/no-named-as-default-member': 'off',
        'import/no-named-as-default': 'off',
        'import/export': 'error',
        'import/newline-after-import': ['error', { count: 1 }],
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
            alphabetize: { order: 'asc' },
          },
        ],

        // Prettier
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
      },
    },
  ],
  storybook.configs['flat/recommended'],
)
