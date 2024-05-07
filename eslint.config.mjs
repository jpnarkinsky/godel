// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export const config = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      indent: ["error", 2],
      semi: ["error", "never"],
    }
  }
);

