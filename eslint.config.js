// eslint.config.js
import globals from "globals";
import js from "@eslint/js";
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...pluginVue.configs["flat/essential"],
  eslintConfigPrettier,
  {
    ignores: ['node_modules', 'dist', 'public', '.nuxt']
  },
  {
      languageOptions: {
          ecmaVersion: 'latest',
          sourceType: "module",
          globals: {
              ...globals.browser,
              ...globals.node,
          }
      },
      rules: {
          'vue/multi-word-component-names': 'off',
          'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
          'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
          "prettier/prettier": process.env.NODE_ENV === 'production' ? 'warn' : 'off'
      }
  }
];