// 完全引入
// import "core-js";

// 按需导入
// import "core-js/es/promise";

import count from "./js/count";
import sum from "./js/sum";
// import { mul } from "./js/math";

// 要想webpack打包资源，必须引入该资源
import "./css/index.css"
import "./less/index.less"
import "./sass/index.sass"
import "./sass/index.scss"
import "./styl/index.styl"

import "./css/iconfont.css";


const result1 = count(2, 1);
console.log(result1);
const result2 = sum(1, 2, 3, 4,5);
console.log(result2);

document.getElementById("btn").onclick = function () {
    // 动态导入 --> 实现按需加载
    // 即使只被引用了一次，也会代码分割
    import(/* webpackChunkName: "math" */ "./js/math.js").then(({ mul }) => {
        console.log(mul(3,2))
    });
};

// 判断是否支持HMR功能
if (module.hot) {
    module.hot.accept("./js/count.js", function (count) {
        const result1 = count(2, 1);
        console.log(result1);
    });

    module.hot.accept("./js/sum.js", function (sum) {
        const result2 = sum(1, 2, 3, 4);
        console.log(result2);
    });
}
// 添加promise代码
const promise = Promise.resolve();
promise.then(() => {
    console.log("hello promise");
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {
                console.log("SW registered: ", registration);
            })
            .catch((registrationError) => {
                console.log("SW registration failed: ", registrationError);
            });
    });
}

