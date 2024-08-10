const globals = require("globals");
const pluginJs = require("@eslint/js");
const pluginEslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  // Node.js environment
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
  },
  // Browser environment
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  // Jest environment
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    ignores: [".husky/*", "assets/*", "coverage/*"],
  },
  pluginJs.configs.recommended,
  // Prettier configuration
  pluginEslintConfigPrettier,
];
