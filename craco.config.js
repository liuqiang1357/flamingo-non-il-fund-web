const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // See all theme variables (dark override default):
              // https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
              // https://github.com/ant-design/ant-design/blob/master/components/style/themes/dark.less

              // Prefer modifying more abstract variables (check the impact)
              // Base scaffolding variables
              '@font-size-base': '16px',
              '@link-color': 'invalid',
              '@link-hover-color': 'invalid',
              '@link-active-color': 'invalid',
              '@link-decoration': 'invalid',
              '@link-hover-decoration': 'invalid',
              '@link-focus-decoration': 'invalid',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    configure: webpackConfig => {
      // Fix import outside src, see https://stackoverflow.com/a/60353355
      const scopePluginIndex = webpackConfig.plugins.findIndex(plugin => {
        return plugin.constructor && plugin.constructor.name === 'ModuleScopePlugin';
      });
      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

      // Hide source map warnings
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];

      return webpackConfig;
    },
  },
};
