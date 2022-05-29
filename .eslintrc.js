module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	parserOptions: {
		requireConfigFile: false,
	},
	extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'prettier', '@nuxtjs/eslint-config-typescript'],
	plugins: [],
	// add your custom rules here
	rules: {
		"arrow-parens": "off",
		"spaced-comment": "off",
		"no-console": "off",
		"no-tabs": "off",
		"indent": "off",
		"quotes": "off",
		"semi": "off",
		"space-before-function-paren": "off",
		"comma-dangle": "off",
		"camelcase": "off"
	},
}
