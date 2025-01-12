const path = require('path');
const UIOrganizerWebpackPlugin = require('ui-organizer-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    index: './src-client/app-client.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, `../dist`),
    chunkFilename: '[name].js',
    assetModuleFilename: '[name][ext]',
    clean: true
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader'
      },
      {
        test: /\.css$/,
        type: 'asset/resource',              
      },
      {
        test: /\.html$/,
        type: 'asset/resource',
      },      
      {
        test: /\.md$/,
        type: 'asset/resource',
    }
    ],
  },
  plugins: [
    new UIOrganizerWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "./content", to: "./content" },
        { from: "./node_modules/@fortawesome/fontawesome-free", to: "./fontawesome-free" },
        { from: "./node_modules/highlight.js/", to: "./highlightjs" },
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  }
};