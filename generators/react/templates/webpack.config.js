var path = require("path"),
  pkg = require("../../../package.json"),
  commonConfig = require("../../webpack.common.config");

var isProduction =
  process.argv.indexOf("-p") >= 0 || process.env.NODE_ENV === "production";

var clientAppConfig = Object.assign({}, commonConfig, {
  context: path.join(__dirname, "."),
  entry: "./App.tsx",
  output: {
    path: isProduction
      ? path.resolve(__dirname, "../../../Server/<%= Name %>/js")
      : pkg.dnn.pathsAndFiles.devSitePath +
        "\\DesktopModules\\MVC\\FormaMed\\<%= ModuleName %>\\js",
    filename: "<%= Name.toLowerCase() %>.js"
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    mainFields: ["module", "browser", "main"],
    alias: {
      app: path.resolve(__dirname, "src/app/")
    }
  }
});

module.exports = clientAppConfig;
