var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var DashboardPlugin = require('webpack-dashboard/plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var combineLoaders = require('webpack-combine-loaders');
//var MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  devtool: 'eval',
  entry: './src/index.js',
  target: 'web',
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve('build'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json', '.css']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/\.json$/',
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react']
          }
        }
      },
      {
        test: /\.json$/,
        enforce: 'pre',
        use: {
          loader: require.resolve('./strip-json-loader'),
        },
        type: "javascript/auto"
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: combineLoaders([
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          }
        ])
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'public/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: 'styles.css'
    // })
  ],
  devServer: {
    hot: true,
    quiet: true,
    inline: true,
    stats: false,
    watchOptions: { poll: 1000, ignored: /node_modules/ }
  }
};
