// no-undef is the rule that matters here: an undefined identifier is a runtime
// bug, and the least exercised code needs that check most. The globals are the
// host's - a CAP server plus the transpiled ABAP runtime, whose global is
// `abap`. Nothing else is switched on; the tests are the real gate.
module.exports = [
  {
    ignores: ["node_modules/**", "runtime/**", ".upstream/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        abap: "readonly",
        require: "readonly",
        module: "writable",
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        fetch: "readonly",
        structuredClone: "readonly",
        setTimeout: "readonly",
        Proxy: "readonly",
        Reflect: "readonly",
        AbortSignal: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["error", { args: "none" }],
    },
  },
  {
    // byte for byte upstream's (scripts/vendor-agent.mjs): its eslint-disable
    // comments are for upstream's rules, which are not switched on here
    files: ["plugin/lib/agent/vendor/**"],
    linterOptions: { reportUnusedDisableDirectives: "off" },
  },
  {
    files: ["**/*.js", "**/*.cjs"],
    languageOptions: { sourceType: "commonjs" },
  },
];
