import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
    { files: ["src/**/*.ts"] },
    { ignores: ["dist/**/*", "node_modules/**/*"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
];
