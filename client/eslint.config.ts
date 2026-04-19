import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended, // TypeScript rules

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    
    rules: {
      // 🔹 General
      "no-unused-vars": "off", // handled by TS
      "@typescript-eslint/no-unused-vars": ["warn"],

      // 🔹 React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // 🔹 Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // 🔹 TypeScript best practices
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];