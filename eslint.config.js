// @ts-check

import eslint from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: [
          './packages/*/tsconfig.json'
        ],
        tsconfigRootDir: import.meta.dirname,
        warnOnUnsupportedTypeScriptVersion: false
      }
    }
  },
  prettierConfig
)
