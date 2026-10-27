import antfu from "@antfu/eslint-config";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import { getDefaultAttributes } from "eslint-plugin-better-tailwindcss/api/defaults";

// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  antfu(
    {
      type: "app",
      vue: true,
      typescript: true,
      formatters: true,
      markdown: true,
      stylistic: {
        indent: 2,
        semi: true,
        quotes: "double",
      },
      ignores: [".pnpm-store/**", "**/migrations/*"],
    },
    {
      rules: {
        "vue/max-attributes-per-line": [
          "error",
          {
            singleline: {
              max: 2,
            },
            multiline: {
              max: 1,
            },
          },
        ],
        "ts/no-redeclare": "off",
        "ts/consistent-type-definitions": ["error", "type"],
        "no-console": ["warn"],
        "antfu/no-top-level-await": ["off"],
        "node/prefer-global/process": "off",
        "node/no-process-env": ["off"],
        "perfectionist/sort-imports": [
          "error",
          {
            type: "natural",
            order: "asc",
            groups: [
              "builtin",
              "external",
              "internal",
              "parent",
              "sibling",
              "index",
              "side-effect",
              "type",
              "unknown",
            ],
            internalPattern: ["^~/.+"],
          },
        ],
        "unicorn/filename-case": [
          "error",
          {
            case: "kebabCase",
            ignore: ["README.md"],
          },
        ],
      },
    },
    {
      files: ["**/*.md"],
      rules: {
        "no-trailing-spaces": "off",
      },
    },
  ),

  betterTailwindcss.configs["correctness-error"],
  {
    settings: {
      "better-tailwindcss": {
        entryPoint: "app/assets/css/main.css",
        attributes: [
          ...getDefaultAttributes(),
          [
            "^v-bind:ui$",
            [
              { match: "objectValues" },
            ],
          ],
        ],
      },
    },
  },

  {
    files: ["public/companion/**/*.js"],
    languageOptions: {
      globals: {
        chrome: "readonly",
        browser: "readonly",
      },
    },
  },
);
