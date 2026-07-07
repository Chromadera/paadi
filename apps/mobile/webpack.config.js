const path = require("path");

module.exports = async function (webpackConfig) {
  webpackConfig.resolve = webpackConfig.resolve || {};
  webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
  webpackConfig.resolve.alias["@"] = path.resolve(__dirname);
  // Fix Expo web entry resolution in monorepo — node_modules is hoisted to root
  webpackConfig.resolve.modules = [
    path.resolve(__dirname, "node_modules"),
    path.resolve(__dirname, "../../node_modules"),
    "node_modules",
  ];
  return webpackConfig;
};
