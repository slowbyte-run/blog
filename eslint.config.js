import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

const reactRules = {
  ...reactPlugin.configs.flat.recommended.rules,
  ...reactPlugin.configs.flat['jsx-runtime'].rules,
  ...reactHooksPlugin.configs['recommended-latest'].rules,
  ...jsxA11yPlugin.configs.recommended.rules,
  'react/react-in-jsx-scope': 'off',
  'react/prop-types': 'off',
};

const commonReactConfig = {
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    'jsx-a11y': jsxA11yPlugin,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: reactRules,
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    globals: {
      console: 'readonly',
      document: 'readonly',
      fetch: 'readonly',
      navigator: 'readonly',
      module: 'readonly',
      process: 'readonly',
      require: 'readonly',
      __dirname: 'readonly',
      __filename: 'readonly',
      window: 'readonly',
    },
  },
};

export default tseslint.config(
  {
    ignores: [
      '.astro/**',
      'dist/**',
      'logs/**',
      'node_modules/**',
      'public/**',
    ],
  },
  {
    files: ['**/*.{js,jsx}'],
    extends: [js.configs.recommended],
    ...commonReactConfig,
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    ...commonReactConfig,
    languageOptions: {
      ...commonReactConfig.languageOptions,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
