import globals from "globals";
import js from "@eslint/js";
import json from "@eslint/json";
import jasmine from "eslint-plugin-jasmine";
import stylisticJs from '@stylistic/eslint-plugin-js';
import { defineConfig, globalIgnores } from "eslint/config";


export default defineConfig([
	// Globally ignore package lock files
	globalIgnores(["**/package-lock.json"]),
	// Define config for default js files
	{
		files: ["**/*.{js,mjs,cjs}"],
		ignores: ["spec/*.js"],
		plugins: {
			js,
			'@stylistic/js': stylisticJs,
		},
		extends: ["js/recommended"],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
				atom: "readonly",
			},
		},
		rules: {
			"@stylistic/js/comma-dangle": ["error", "always-multiline"],
			"@stylistic/js/indent": ["error", "tab", { SwitchCase: 1 }],
			"@stylistic/js/no-tabs": ["error", { allowIndentationTabs: true }],
			"no-console": "warn",
			"no-unused-vars": "warn",
		},
	},
	//Define config for spec files
	{
		files: ["spec/*-spec.js"],
		plugins: { jasmine },
		extends: ["jasmine/recommended"],
		languageOptions: {
			globals: {
				...globals.jasmine,
				...globals.atomtest,
			},
		},
	},
	// Define config for json files
	{
		files: ["**/*.json"],
		plugins: { json },
		language: "json/json",
		extends: ["json/recommended"],
	},
]);
