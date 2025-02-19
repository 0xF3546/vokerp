const path = require('path')
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const buildPath = path.join("D:\\vokerp\\txData\\server.base\\resources\\[gameplay]\\vokerp");

const server = (env) => ({
    entry: ['./server/server.ts'],
    target: "node",
    node: {
        __dirname: true,
    },
    output: {
        path: path.resolve(buildPath, 'server'),
        filename: 'server.js',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader'],
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    optimization: {
        minimize: true
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [new TsconfigPathsPlugin(
            {
                configFile: path.resolve(__dirname, './server/tsconfig.json')
            }
        )]
    }
})

const client = () => ({
    entry: ['./client/client.ts'],
    target: "web",
    output: {
        path: path.resolve(buildPath, 'client'),
        filename: 'client.js',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader'],
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    optimization: {
        minimize: false
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [new TsconfigPathsPlugin(
            {
                configFile: path.resolve(__dirname, './client/tsconfig.json')
            }
        )]
    }
})

module.exports = [server, client];