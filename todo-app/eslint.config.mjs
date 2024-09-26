import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.browser, // Move globals here if you want to apply them to all JS files
    },
  },
  {
    ignores: [
      "**/node_modules/**", // Ignore node_modules
      "**/dist/**", // Ignore dist
      "**/*.test.js", // Ignore test files
    ],
  },
  pluginJs.configs.recommended,
];
