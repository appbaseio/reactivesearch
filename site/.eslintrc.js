module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: ['airbnb'],
	env: {
		browser: true,
	},
	parser: 'babel-eslint',
	rules: {
		indent: 0,
		'no-tabs': 0,
		'no-underscore-dangle': 0,

		'react/jsx-indent': 0,
		'react/jsx-indent-props': 0,
		'react/jsx-filename-extension': 0,
		'react/jsx-one-expression-per-line': 0,
		'react/forbid-prop-types': 0,
	},
};
