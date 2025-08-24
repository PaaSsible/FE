// .eslintrc.js
// Storybook, React, TypeScript, Prettier 환경을 통합한 ESLint 설정
import storybook from 'eslint-plugin-storybook'
import react from 'eslint-plugin-react'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'

export default tseslint.config(
  [
    // 빌드 산출물(dist) 폴더는 ESLint 검사에서 제외
    globalIgnores(['dist']),
    {
      files: ['**/*.{ts,tsx}'], // TS/TSX 파일만 적용
      extends: [
        js.configs.recommended, // JS 기본 룰
        tseslint.configs.recommended, // TS 기본 룰
        reactHooks.configs['recommended-latest'], // React Hooks 룰
        reactRefresh.configs.vite, // Vite + React Refresh 룰
        react.configs.flat.recommended, // React JSX/Props 관련 룰
      ],
      settings: {
        react: {
          version: 'detect', // React 버전 자동 감지
        },
        'import/resolver': {
          // tsconfig paths와 alias를 참조
          typescript: {
            alwaysTryTypes: true,
            project: './tsconfig.json',
          },
        },
      },
      languageOptions: {
        ecmaVersion: 2020, // 최신 JS 문법 지원
        globals: globals.browser, // 브라우저 전역 변수 허용 (window, document 등)
      },
      plugins: {
        import: importPlugin, // import 정렬/검사 플러그인
        prettier: prettierPlugin, // Prettier 플러그인
      },
      rules: {
        // --------------------
        // TypeScript 규칙
        // --------------------
        '@typescript-eslint/explicit-module-boundary-types': 'warn', // 함수 시그니처 타입 명시 경고
        '@typescript-eslint/no-explicit-any': 'error', // any 사용 금지
        '@typescript-eslint/no-empty-function': ['error'], // 빈 함수 금지
        '@typescript-eslint/no-require-imports': ['error', { allow: ['~/asset/*'] }], // require import 제한
        '@typescript-eslint/no-unused-expressions': [
          'error',
          { allowShortCircuit: true, allowTernary: true },
        ], // short circuit, ternary 허용
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 사용하지 않는 변수 경고, '_'로 시작하면 무시

        // --------------------
        // React 규칙
        // --------------------
        'react/react-in-jsx-scope': 'off', // React 17+에서는 import React 필요 없음
        'react/jsx-uses-vars': 'error', // JSX 변수 사용 체크
        'react/jsx-uses-react': 'off', // React 17+에서 불필요

        // --------------------
        // import 관련 규칙
        // --------------------
        'import/no-named-as-default-member': 'off',
        'import/no-named-as-default': 'off',
        'import/export': 'error', // 잘못된 export 방지
        'import/newline-after-import': ['error', { count: 1 }], // import 후 개행
        'import/order': [
          // import 정렬
          'error',
          {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            pathGroups: [
              { pattern: '~/**', group: 'internal' }, // ~ alias
              { pattern: '@/**', group: 'internal' }, // @ alias
            ],
            pathGroupsExcludedImportTypes: ['builtin'],
            alphabetize: { order: 'asc' },
            'newlines-between': 'always',
          },
        ],
        'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }], // .ts/.tsx 확장자 생략 강제

        // --------------------
        // Prettier 규칙
        // --------------------
        'prettier/prettier': ['error', { endOfLine: 'auto' }], // 줄바꿈 자동 감지
      },
    },
    {
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'], // 테스트 파일
      env: { jest: true }, // Jest 환경 적용
      rules: {
        '@typescript-eslint/no-explicit-any': 'off', // 테스트에서는 any 허용
      },
    },
  ],
  storybook.configs['flat/recommended'], // Storybook 권장 룰 포함
)
