const path = require('node:path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (_env, argv = {}) => ({
    entry: './src/index.jsx',
    output: { path: path.resolve(__dirname, 'public'), filename: 'app.js', assetModuleFilename: 'assets/[name].[contenthash][ext]' },
    devServer: { port: 8080, static: { directory: path.resolve(__dirname, 'public') }, hot: true },
    resolve: { extensions: ['.js', '.jsx'] },
    plugins: [new MiniCssExtractPlugin({ filename: 'app.css' }), new HtmlWebpackPlugin({ template: './src/index.html' })],
    module: { rules: [
        { test: /\.jsx?$/, exclude: /node_modules/, use: { loader: 'babel-loader', options: { presets: [['@babel/preset-env', { targets: 'defaults' }], ['@babel/preset-react', { runtime: 'automatic', development: argv.mode !== 'production' }]] } } },
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
        { test: /\.(woff2?|ttf|eot|svg|png|jpe?g|gif)$/i, type: 'asset/resource' }
    ] },
    performance: { maxAssetSize: 600000, maxEntrypointSize: 1000000 }
})
