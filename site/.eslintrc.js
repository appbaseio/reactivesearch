module.exports = {
	extends: ['airbnb', 'plugin:jest/recommended'],
	plugins: ['jest'],
	env: {
		browser: true,
	},
	parser: 'babel-eslint',
	rules: {
		indent: 0,
		'no-tabs': 0,
		'eol-last': ['error', 'always'],
		'no-underscore-dangle': 0,
		camelcase: 0, // shopify and appbase data includes _

		'react/jsx-indent': 0,
		'react/jsx-indent-props': 0,
		'react/jsx-filename-extension': 0,
		'react/forbid-prop-types': 0,
		'react/require-default-props': 0,
	},
	settings: {
		'import/resolver': {
			'babel-module': {
				root: ['./'],
				alias: {
					components: './components',
					config: './config',
					utils: './utils',
					constants: './constants',
					styles: './styles',
					template: './templates/active',
				},
			},
		},
	},
};
