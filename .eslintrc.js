"use strict";

module.exports = {
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"parser": "@typescript-eslint/parser",
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020
	},
	"plugins": [
		"@typescript-eslint"
	],
	env: {
		es6: true,
		browser: true,
	},
	rules: {
		"no-self-assign": [
			"off"
		],
		indent: [
			"error",
			"tab",
			{ "SwitchCase": 1 }
		],
		semi: [
			"error",
			"always"
		],
		"require-await": [
			"error"
		],
		"no-constant-condition": [
			"off"
		]
	}
};
