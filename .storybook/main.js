module.exports = {
  "stories": [
    "../packages/**/stories/**/*.stories.@(js|jsx|ts|tsx|mjs)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /s[ac]ss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
      ],
    })
    return config
  }
}
