module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  plugins: ["react", "jsx-a11y", "@typescript-eslint", "simple-import-sort"],
  ignorePatterns: ["node_modules/*", "dist/*", "generated/*", "emp-config.js"],
  env: {
    browser: true,
    node: true,
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/function-component-definition": "off",
    "react/jsx-filename-extension": ["error", { extensions: [".js", ".tsx"] }],
    "import/no-unresolved": "off", // delegate this to typescript
    "import/extensions": ["error", "never"],
    "import/prefer-default-export": "off",
    "no-use-before-define": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "react/require-default-props": "off",
    "react/jsx-props-no-spreading": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "react/jsx-curly-newline": "off",
    "no-console": "error",
    "prettier/prettier": ["error"],
  },
};
