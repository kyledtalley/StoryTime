module.exports = function (api) {
	api.cache(true)
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			"nativewind/babel",
			"react-native-reanimated/plugin",
			[
				"inline-dotenv",
				{
					path: ".env",
					safe: false,
					systemVar: true,
				},
			],
		],
	}
}
