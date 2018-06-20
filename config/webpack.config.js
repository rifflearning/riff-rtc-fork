var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var HtmlWebpackPlugin = require('html-webpack-plugin');

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
    ],
};
