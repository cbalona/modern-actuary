// @ts-check

import eslint from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import svelte from "eslint-plugin-svelte"
import globals from "globals"
import tseslint from "typescript-eslint"
import { defineConfig } from "eslint/config"

export default defineConfig(
  {
    ignores: ["**/.svelte-kit/**", "**/build/**", "**/dist/**", "README.md", "static/content/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: [".svelte"],
        parser: tseslint.parser,
      },
    },
  },
  eslintConfigPrettier,
)
