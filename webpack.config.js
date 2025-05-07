const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const glob = require('glob');  // Glob-Paket einbinden, um alle Dateien zu finden

//const buildPath = path.join("D:\\vokerp\\txData\\server.base\\resources\\[gameplay]\\vokerp");
const buildPath = path.resolve(__dirname, 'build');

const server = (env) => ({
    entry: glob.sync('./server/**/*.ts'),  // Alle .ts-Dateien im server/ Verzeichnis einbeziehen
    target: "node",
    node: {
        __dirname: true,
    },
    output: {
        path: path.resolve(buildPath, 'server'),
        filename: 'server.js',  // Name der Ausgabedatei
    },
    devtool: 'source-map',  // Hinzufügen von Source Maps für einfaches Debugging
    module: {
        rules: [
            {
                test: /\.tsx?$/,  // Verarbeitung von TypeScript-Dateien
                use: ['ts-loader'],  // Verwende ts-loader, um TypeScript zu kompilieren
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()  // Löscht die Ausgabeordner vor jedem Build
    ],
    optimization: {
        minimize: false,  // Deaktiviert das Minimieren des Codes
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [new TsconfigPathsPlugin({
            configFile: path.resolve(__dirname, './server/tsconfig.json')
        })]
    }
});

const client = () => ({
    entry: glob.sync('./client/**/*.ts'),  // Alle .ts-Dateien im client/ Verzeichnis einbeziehen
    target: "web",  // Für Webanwendungen
    output: {
        path: path.resolve(buildPath, 'client'),
        filename: 'client.js',  // Name der Ausgabedatei
    },
    devtool: 'source-map',  // Hinzufügen von Source Maps für das Frontend
    module: {
        rules: [
            {
                test: /\.tsx?$/,  // Verarbeitung von TypeScript-Dateien
                use: ['ts-loader'],
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()  // Löscht die Ausgabeordner vor jedem Build
    ],
    optimization: {
        minimize: false,  // Deaktiviert das Minimieren des Codes für den Client
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [new TsconfigPathsPlugin({
            configFile: path.resolve(__dirname, './client/tsconfig.json')
        })]
    }
});

module.exports = [server, client];
