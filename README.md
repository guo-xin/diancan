# diancan

- development:

    - 说明:开发阶段
    - 执行命令:npm run dev
    - 下载 微信web开发者工具
    - 微信公众号（v1/manage/wxjs_conf 返回的appid所对应的公众号）后台 绑定微信开发者

    > 热加载; ESlint语法检查; scss -> css -> postcss[px2rem, autoprefixer]; javascript es6 -> es5; 样式内联, 资源未压缩;


- production

    - 说明:生产环境构建
    - 执行命令:npm run build

    > scss -> css -> postcss[px2rem, autoprefixer]; javascript es6 -> es5; 图片<10000 -> base64; 资源压缩; URL加MD5

- testing

    - 说明:测试环境构建
    - 执行命令:npm run build_test

    > 同 production; API 地址请求为`测试环境`
