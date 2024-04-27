# 基础部分-Part1

## 前言

### 为什么需要打包工具？

开发时，我们会使用框架（React、Vue），ES6 模块化语法，Less/Sass 等 css 预处理器等语法进行开发。

**这样的代码要想在浏览器运行必须经过编译成浏览器能识别的 JS、Css 等语法，才能运行。**

> **打包的实际目的: 将一些自己编写的代码`编译`成浏览器识别语法的过程**

所以我们需要打包工具帮我们做完这些事。

除此之外，打包工具还能压缩代码、做兼容性处理、提升代码性能等。

### 有哪些打包工具？

- Grunt
- Gulp
- Parcel
- Webpack
- Rollup
- Vite
- ...

目前市面上最流量的是 Webpack，所以我们主要以 Webpack 来介绍使用打包工具

## 基本使用

**`Webpack` 是一个静态资源打包工具。**

它会以一个或多个文件作为打包的入口，将我们整个项目所有文件编译组合成一个或多个文件输出出去。

输出的文件就是编译好的文件，就可以在浏览器段运行了。

我们将 `Webpack` 输出的文件叫做 `bundle`。

### 功能介绍

Webpack 本身功能是有限的:

- 开发模式：仅能编译 JS 中的 `ES Module` 语法
- 生产模式：能编译 JS 中的 `ES Module` 语法，还能压缩 JS 代码

### 开始使用

#### 1. 资源目录

```
webpack_code # 项目根目录（所有指令必须在这个目录运行）
    └── src # 项目源码目录
        ├── js # js文件目录
        │   ├── count.js
        │   └── sum.js
        └── main.js # 项目主文件
```

#### 2. 创建文件

- count.js

```js
export default function count(x, y) {
  return x - y;
}
```

- sum.js

```js
export default function sum(...args) {
  return args.reduce((p, c) => p + c, 0);
}
```

- main.js

```js
import count from "./js/count";
import sum from "./js/sum";

console.log(count(2, 1));
console.log(sum(1, 2, 3, 4));
```

![](https://cdn.jsdelivr.net/gh/Killer-89757/PicBed/images/2024%2F04%2Fimage-20240427071528152-11c702.png)

#### 3. 下载依赖

打开终端，来到项目根目录。运行以下指令：

- 初始化`package.json`

```
npm init -y
```

此时会生成一个基础的 `package.json` 文件。

![](https://cdn.jsdelivr.net/gh/Killer-89757/PicBed/images/2024%2F04%2Fimage-20240427071937776-698c3a.png)

**需要注意的是 `package.json` 中 `name` 字段不能叫做 `webpack`, 否则下一步会报错**

- 下载依赖

```
npm i webpack webpack-cli -D
```

#### 4. 启用 Webpack

- 开发模式

```
npx webpack ./src/main.js --mode=development
```

![](https://cdn.jsdelivr.net/gh/Killer-89757/PicBed/images/2024%2F04%2Fimage-20240427072656909-6924c8.png)

在开发环境下，会输出每个模块的具体信息，每个函数其实都是被eval函数包裹起来了

确实可以编辑ES6的模块化语法，但是像箭头函数、...等语法是没有编译的

- 生产模式

```
npx webpack ./src/main.js --mode=production
```

![](https://cdn.jsdelivr.net/gh/Killer-89757/PicBed/images/2024%2F04%2Fimage-20240427072745952-326e8b.png)

npx 会将我们的`node_modules`中的`.bin`目录暂时添加到环境变量

`npx webpack`: 是用来运行本地安装 `Webpack` 包的。

`./src/main.js`: 指定 `Webpack` 从 `main.js` 文件开始打包，不但会打包 `main.js`，还会将其依赖也一起打包进来。

`--mode=xxx`：指定模式（环境）。

#### 5. 观察输出文件

默认 `Webpack` 会将文件打包输出到 `dist` 目录下，我们查看 `dist` 目录下文件情况就好了

![](https://cdn.jsdelivr.net/gh/Killer-89757/PicBed/images/2024%2F04%2Fimage-20240427073222660-791f5f.png)

![](https://cdn.jsdelivr.net/gh/Killer-89757/PicBed/images/2024%2F04%2Fimage-20240427073329532-2aa3fe.png)

### 小结

`Webpack` 本身功能比较少，只能处理 `js` 资源，一旦遇到 `css` 等其他资源就会报错。

所以我们学习 `Webpack`，就是主要学习如何处理其他资源

---

## 基本配置

在开始使用 `Webpack` 之前，我们需要对 `Webpack` 的配置有一定的认识。

### 5 大核心概念

1. entry（入口）

指示 Webpack 从哪个文件开始打包

2. output（输出）

指示 Webpack 打包完的文件输出到哪里去，如何命名等

3. loader（加载器）

**webpack 本身只能处理 js、json 等资源**，其他资源需要借助 loader，Webpack 才能解析

4. plugins（插件）

扩展 Webpack 的功能

5. mode（模式）

主要由两种模式：

- 开发模式：development
- 生产模式：production

### 准备 Webpack 配置文件

在项目根目录下新建文件：`webpack.config.js`

> - 要点：
>   - 一定要位于根目录下
>   - 名称就是`webpack.config.js`

![](https://cdn.jsdelivr.net/gh/Killer-89757/PicBed/images/2024%2F04%2Fimage-20240427074053247-99f050.png)

```js
module.exports = {
  // 入口
  entry: "",
  // 输出
  output: {},
  // 加载器
  module: {
    rules: [],
  },
  // 插件
  plugins: [],
  // 模式
  mode: "",
};
```

Webpack 是基于 Node.js 运行的，所以采用 Common.js 模块化规范

### 修改配置文件

1. 配置文件

```js
// Node.js的核心模块，专门用来处理文件路径
const path = require("path");

module.exports = {
  // 入口
  // 相对路径和绝对路径都行
  entry: "./src/main.js",
  // 输出
  output: {
    // path: 文件输出目录，必须是绝对路径
    // path.resolve()方法返回一个绝对路径
    // __dirname 当前文件的文件夹绝对路径
    path: path.resolve(__dirname, "dist"),
    // filename: 输出文件名
    filename: "main.js",
  },
  // 加载器
  module: {
    rules: [],
  },
  // 插件
  plugins: [],
  // 模式
  mode: "development", // 开发模式
};
```

2. 运行指令

```:no-line-numbers
npx webpack
```

此时功能和之前一样，也不能处理样式资源

![](https://cdn.jsdelivr.net/gh/Killer-89757/PicBed/images/2024%2F04%2Fimage-20240427074637713-8449a7.png)

### 小结

Webpack 将来都通过 `webpack.config.js` 文件进行配置，来增强 Webpack 的功能

我们后面会以两个模式来分别搭建 Webpack 的配置，先进行开发模式，再完成生产模式

