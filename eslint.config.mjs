import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";

import quality from "./eslint-rules/index.cjs";

// Globals shared across <script> files (see CLAUDE.md "Key globals").
const projectGlobals = Object.fromEntries(
  [
    "CONFIG", "TILE", "SOLID_TILES", "ST", "GS", "CHAR_MAP", "Input", "Audio",
    "Sprites", "Entity", "Player", "Goomba", "Koopa", "CoinEntity",
    "PowerUpEntity", "Fireball", "BounceCoin", "ScorePopup", "LEVELS", "Level",
    "HUD", "Game",
  ].map((name) => [name, "writable"]),
);

export default defineConfig([
  {
    files: ["js/**/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        performance: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        AudioContext: "readonly",
        webkitAudioContext: "readonly",
        Image: "readonly",
        ...projectGlobals,
      },
    },
  },
  js.configs.recommended,
  {
    files: ["js/**/*.js"],
    plugins: { quality },
    rules: {
      // Classes/consts are shared between <script> files; only check locals.
      // Baseline: 8 violations. Back to "error" when it reaches zero.
      "no-unused-vars": [
        "warn",
        { vars: "local", argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-redeclare": "off",
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-var": "error",
      "prefer-const": "error",
      "quality/max-lines": ["error", { max: 350 }],
      "quality/no-direct-console": [
        "error",
        { logger: "the project logging helper" },
      ],
    },
  },
  {
    files: ["eslint-rules/**/*.cjs"],
    languageOptions: {
      globals: { module: "readonly", require: "readonly", process: "readonly" },
    },
  },
  globalIgnores([
    ".claude/**",
    "node_modules/**",
    "copa-predictor-2026/**",
    "*.html",
  ]),
]);
