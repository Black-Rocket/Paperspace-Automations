module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: ['google'],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	rules: {
		'linebreak-style': ['error', 'windows'],
		'indent': [2, 'tab'],
		'no-tabs': 0,
	},
};
