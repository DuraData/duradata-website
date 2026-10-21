import js from "@eslint/js"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

const eslintConfig = tseslint.config(
	{
		ignores: [
			"lib/generated/**",
			".next/**",
			"node_modules/**",
			"coverage/**",
			"playwright-report/**",
			"test-results/**",
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["**/*.{js,mjs,cjs,ts,tsx}"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			"react-hooks": reactHooks,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			// Preserve the project's previous lint baseline while avoiding the vulnerable
			// eslint-config-next dependency chain.
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"no-empty": "off",
			"no-useless-escape": "off",
			"react-hooks/set-state-in-effect": "off",
			"react-hooks/purity": "off",
		},
	},
)

export default eslintConfig
