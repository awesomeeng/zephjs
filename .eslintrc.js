"use strict";

module.exports = {
	"extends": "eslint:recommended",
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 8
	},
    env: {
        es6: true
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
