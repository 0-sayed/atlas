import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist',
      'dist-server',
      '.local',
      'coverage',
      'playwright-report',
      'test-results',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-restricted-globals': [
        'error',
        'process',
        'Buffer',
        'require',
        'module',
        'exports',
        '__dirname',
        '__filename',
        'global',
      ],
    },
  },
  {
    files: [
      'vite.config.ts',
      'playwright.config.ts',
      'e2e/**/*.{ts,tsx}',
      'server/**/*.ts',
      'scripts/**/*.ts',
    ],
    languageOptions: { globals: globals.node },
  },
)
