# diancan

- development:

    - 说明:开发阶段
    - 执行命令:npm run-script dev

    > 热加载; ESlint语法检查; scss -> css -> postcss[px2rem, autoprefixer]; javascript es6 -> es5; 样式内联, 资源未压缩;


- production

    - 说明:生产环境构建
    - 执行命令:npm run-script build

    > scss -> css -> postcss[px2rem, autoprefixer]; javascript es6 -> es5; 图片<10000 -> base64; 资源压缩; URL加MD5

- testing

    - 说明:测试环境构建
    - 执行命令:npm run-script build_test

    > 同 production; API 地址请求为`测试环境`
