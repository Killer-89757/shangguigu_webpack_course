// Node.js的核心模块，专门用来处理文件路径
// nodejs核心模块，直接使用
const os = require("os");

const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// js压缩
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

// cpu核数
const threads = os.cpus().length;

// 获取处理样式的Loaders
const getStyleLoaders = (preProcessor) => {
    return [
        MiniCssExtractPlugin.loader,
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                },
            },
        },
        preProcessor,
    ].filter(Boolean);
};

module.exports = {
    // 入口
    // 相对路径和绝对路径都行
    entry: "./src/main.js",
    // 输出
    output: {
        // 所有文件的输出路径
        path: path.resolve(__dirname, "../dist"), // 生产模式需要输出
        // filename: "static/js/[name].js", // 将 js 文件输出到 static/js 目录中
        clean: true,
        // 给打包输出的其他文件命名
        // chunkFilename: "static/js/[name].chunk.js",

        filename: "static/js/[name].[contenthash:8].js", // 入口文件打包输出资源命名方式
        chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 动态导入输出资源命名方式

        // 图片、字体等通过type:asset处理资源命名规则
        assetModuleFilename:  "static/media/[hash:8][ext][query]"
    },
    // 加载器
    module: {
        rules: [{
            oneOf:[ {
                // 用来匹配 .css 结尾的文件
                test: /\.css$/,
                // use 数组里面 Loader 执行顺序是从右到左
                use: getStyleLoaders()
            },
                {
                    // 用来匹配 .less 结尾的文件
                    test: /\.less$/,
                    use: getStyleLoaders("less-loader"),
                },
                {
                    // 用来匹配 .scss/.sass 结尾的文件
                    test: /\.s[ac]ss$/,
                    // 将sass编译成css文件
                    use: getStyleLoaders("sass-loader"),
                },
                {
                    // 用来匹配 .styl 结尾的文件
                    test: /\.styl$/,
                    // 将styl编译成css文件
                    use: getStyleLoaders("stylus-loader"),
                },
                {
                    test: /\.(png|jpe?g|gif|webp)$/,
                    type: "asset",
                    parser: {
                        dataUrlCondition: {
                            maxSize: 150 * 1024 // 小于150kb的图片会被base64处理
                        }
                    },
                    // generator: {
                    //     // 将图片文件输出到 static/imgs 目录中
                    //     // 将图片文件命名 [hash:8][ext][query]
                    //     // [hash:8]: hash值取8位
                    //     // [ext]: 使用之前的文件扩展名
                    //     // [query]: 添加之前的query参数
                    //     filename: "static/media/[hash:8][ext][query]",
                    // },
                },
                {
                    test: /\.(ttf|woff2?|map4|map3|avi)$/,
                    type: "asset/resource",
                    // generator: {
                    //     filename: "static/media/[hash:8][ext][query]",
                    // },
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,  //排除node_modules中的js文件(这些文件不处理)
                    use:[{
                        loader: "thread-loader", // 开启多进程
                        options: {
                            workers: threads, // 数量
                        },
                    },{
                        loader: 'babel-loader',
                        options: {
                            // presets: ['@babel/preset-env'],
                            cacheDirectory: true, // 开启babel编译缓存
                            cacheCompression: false, // 缓存文件不要压缩
                            plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                        }
                    }]


                },]
        }]
    },
    // 插件
    plugins: [
        new ESLintWebpackPlugin({
            // 指定检查文件的根目录
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules", // 默认值
            cache: true, // 开启缓存
            // 缓存目录
            cacheLocation: path.resolve(
                __dirname,
                "../node_modules/.cache/.eslintcache"
            ),
            threads, // 开启多进程
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        // 提取css成单独文件
        new MiniCssExtractPlugin({
            // 定义输出文件名和目录
            filename: "static/css/[name].css",
            chunkFilename: "static/js/[name].chunk.css",
        }),
        new PreloadWebpackPlugin({
            // rel: "preload", // preload兼容性更好
            // as: "script",
            rel: 'prefetch' // prefetch兼容性更差
        }),
        new WorkboxPlugin.GenerateSW({
            // 这些选项帮助快速启用 ServiceWorkers
            // 不允许遗留任何“旧的” ServiceWorkers
            clientsClaim: true,
            skipWaiting: true,
        }),
        ],
    optimization: {
        minimize: true,
        minimizer: [
        // css压缩也可以写到optimization.minimizer里面，效果一样的
        new CssMinimizerPlugin(),
        // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
        new TerserPlugin({
            parallel: threads // 开启多进程
            }),
        // 压缩图片
        new ImageMinimizerPlugin({
            minimizer: {
                implementation: ImageMinimizerPlugin.imageminGenerate,
                options: {
                    plugins: [
                        ["gifsicle", { interlaced: true }],
                        ["jpegtran", { progressive: true }],
                        ["optipng", { optimizationLevel: 5 }],
                        [
                            "svgo",
                            {
                                plugins: [
                                    "preset-default",
                                    "prefixIds",
                                    {
                                        name: "sortAttrs",
                                        params: {
                                            xmlnsOrder: "alphabetical",
                                        },
                                    },
                                ],
                            },
                        ],
                    ],
                },
            },
        }),],
        splitChunks: {chunks: "all",}, // 对所有模块都进行分割
        // 提取runtime文件
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
        },
    },

    // 开发服务器
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
    },

    // 模式
    mode: "development", // 开发模式
    devtool: "source-map",
};