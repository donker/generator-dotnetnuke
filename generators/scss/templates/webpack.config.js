var path = require("path"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  FileManagerPlugin = require("filemanager-webpack-plugin");

var outPath = path.resolve(__dirname, "../../<%= ModuleName %>");

var <%= Name.toLowerCase() %>AppConfig = {
  context: path.join(__dirname, "."),
  entry: "./scss/styles.scss",
  output: {
    path: outPath,
    filename: "<%= FileOutName %>.css.js"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "<%= FileOutName %>.css"
    }),
    new FileManagerPlugin({
      events: {
        onEnd: {
          delete: [outPath + "/<%= FileOutName %>.css.js"],
        },
      },
    })
  ]
};

module.exports = <%= Name.toLowerCase() %>AppConfig;
