module.exports = {
  plugins: ["react", "jest-dom", "testing-library", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "prettier",
  ],
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["*.test.js", "**/__tests__/**/*.js"],
      env: { jest: true },
      extends: [
        "plugin:jest-dom/recommended",
        "plugin:testing-library/recommended",
      ],
    },
    {
      files: ["**/*.ts"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
      ],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
      },
    },
  ],
  env: { browser: true, node: true },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "no-console": ["error", { allow: ["warn"] }],
    "no-debugger": "error",
    "no-alert": "error",
    "react/prop-types": "off",
  },
};
