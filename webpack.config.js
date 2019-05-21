var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const apiMocker = require('mocker-api');

module.exports = {
    devtool: 'source-map',
    entry: ['@babel/polyfill', './app/index.js'],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index_bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            { test: /\.(js)$/, use: 'babel-loader' },
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]},
            { test: /\.scss$/, use: [ 'style-loader', 'css-loader', 'sass-loader' ]},
        ]
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    plugins: [
        new Dotenv({
        path: path.resolve(__dirname, './.env'), // Path to .env file (this is the default)
        safe: false, // load .env.example (defaults to "false" which does not use dotenv-safe)
        systemvars: true,
        }),
        new HtmlWebpackPlugin({
            template: 'app/index.html'
        })
    ],
    devServer: {
        historyApiFallback: true,
        before(app) {
            apiMocker(app, path.resolve('./mocker/index.js'));
        },
    },
};
