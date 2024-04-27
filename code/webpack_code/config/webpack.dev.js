// Node.js的核心模块，专门用来处理文件路径
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    // 入口
    // 相对路径和绝对路径都行
    entry: "./src/main.js",
    // 输出
    output: {
        // path: 文件输出目录，必须是绝对路径
        // path.resolve()方法返回一个绝对路径
        // __dirname 当前文件的文件夹绝对路径
        path: undefined,
        // filename: 入口文件打包输出文件名
        filename: "static/js/main.js", // 将 js 文件输出到 static/js
    },
    // 加载器
    module: {
        rules: [
            {
                // 用来匹配 .css 结尾的文件
                test: /\.css$/,
                // use 数组里面 Loader 执行顺序是从右到左
                use: ["style-loader", "css-loader"],
            },
            {
                // 用来匹配 .less 结尾的文件
                test: /\.less$/,
                use: ["style-loader", "css-loader","less-loader"],
            },
            {
                // 用来匹配 .scss/.sass 结尾的文件
                test: /\.s[ac]ss$/,
                // 将sass编译成css文件
                use: ["style-loader", "css-loader","sass-loader"],
            },
            {
                // 用来匹配 .styl 结尾的文件
                test: /\.styl$/,
                // 将styl编译成css文件
                use: ["style-loader", "css-loader","stylus-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|webp)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 150 * 1024 // 小于150kb的图片会被base64处理
                    }
                },
                generator: {
                    // 将图片文件输出到 static/imgs 目录中
                    // 将图片文件命名 [hash:8][ext][query]
                    // [hash:8]: hash值取8位
                    // [ext]: 使用之前的文件扩展名
                    // [query]: 添加之前的query参数
                    filename: "static/imgs/[hash:8][ext][query]",
                },
            },
            {
                test: /\.(ttf|woff2?|map4|map3|avi)$/,
                type: "asset/resource",
                generator: {
                    filename: "static/media/[hash:8][ext][query]",
                },
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,  //排除node_modules中的js文件(这些文件不处理)
                loader: 'babel-loader',
                // options: {
                //     presets: ['@babel/preset-env'],
                // },
            },
        ]
    },
    // 插件
    plugins: [
        new ESLintWebpackPlugin({
            // 指定检查文件的根目录
            context: path.resolve(__dirname, "../src"),
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
    ],

    // 开发服务器
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
    },

    // 模式
    mode: "development", // 开发模式
};