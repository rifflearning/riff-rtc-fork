var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var DashboardPlugin = require('webpack-dashboard/plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

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
                }
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                loaders: ['style-loader', 'css-loader'],
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
              loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            // { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
            // ]
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'body',
            template: 'public/index.html'
        }),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env': {
                REACT_APP_DEBUG: JSON.stringify(process.env.REACT_APP_DEBUG)
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new DashboardPlugin()
    ],
    devServer: {
        hot: true,
        quiet: true,
        inline: true,
        stats: false,
        watchOptions: { poll: 1000, ignored: /node_modules/ }
    },
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
};
