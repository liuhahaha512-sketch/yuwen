export default [
  {
    files: ["*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        IntersectionObserver: "readonly",
        localStorage: "readonly",
        setTimeout: "readonly",
        console: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
      "no-console": "off",
    },
  },
];
