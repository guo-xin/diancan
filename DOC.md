## diancan 交接文档
> 好近C端点餐项目,提供给消费者,页面需要在微信中打开,包括好近点餐,好近外卖及订单，配送的店铺信息 四个页面
项目结构

```
| diancan-v2
	|build          *** webpack配置文件
	|config		   ***	提供开发,测试,正式三种环境
	|src			   *** 主要目录
		| assets     *** 公共静态图片
		| components *** vue通用组件
		| filters    *** vue filters
		| methods    *** 公用js,包括微信授权,微信jssdk操作,常用util,Host URL及jsBridge
		| pages      *** 页面目录 每个页面单独生成一个文件夹,需在appConfig.js中注册
			| xxx
				| index.js
				| index.ejs
				| main.vue		
	|static         *** 公共库 不支持require的库
	|.babelrc       *** babel 配置文件
	|.eslintrc.js   *** eslint 配置文件
	|appConfig.js   *** 注册页面js,每个页面都需要在此js中声明
	|package.json   *** npm配置文件
```
> `sudo npm run dev` 启动开发模式 页面为 localhost:{端口}/xxx.html 在微信小程序开发，需要80端口，启动时注意加sudo

> `npm run build_test` 会将所有的接口host替换为测试host

> `npm run build` 会将所有的接口host正式host


* pages
	- index 好近点餐页面
	- order-list 订单页面
	- take-out 好近外卖页面
	- store-list 店铺页面
	- scan-qrcode 扫码点餐
