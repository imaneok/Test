const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const webpackPluginList = [
  { from: './assets', to: './assets' },
]

module.exports = {
  entry: {
    index: './src/app.ts',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'history')],
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
    ],
    defaultRules: [
      { type: 'javascript/auto', resolve: {} },
      { test: /\.json$/i, type: 'json' },
    ],
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  node: {
    fs: 'empty',
  },
  plugins: [
    new webpack.ProvidePlugin({
      PIXI: 'pixi.js',
      'pixi.js': 'pixi.js',
      'stats.js': 'stats.js',
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(webpackPluginList),
  ],
  resolve: {
    alias: {
      'pixi.js': path.resolve(__dirname, './node_modules/pixi.js'),
      PIXI: path.resolve(__dirname, './node_modules/pixi.js'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    library: 'Test',
    libraryTarget: 'var',
  },
  stats: {
    warnings: false,
  },
  externals: {
    TweenLite: 'TweenLite',
  },
}
