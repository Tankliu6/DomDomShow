const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
module.exports = {
    // 建置模式
    mode: "development", // 預設 production
    // 入口
    entry: "./src/index.js",
    // 輸出
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
    },
    // DevServer 設定
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        historyApiFallback: true,
    },
    // 模組載入規則
    module: {
        rules: [
            // SASS 樣式表載入規則
            {
                test: /\.scss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            // Babel
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.(png|svg|jpg|gif|)$/,
                use: { loader: "file-loader" },
            },
        ],
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "./index.html",
        }),
    ],
    resolve: {
        fallback: {
            util: require.resolve("util/"),
        },
    },
};
