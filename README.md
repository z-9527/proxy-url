# proxy-url
谷歌代理请求插件  
基于`Manifest V3`+`React@16.14.0`+`antd@4.15.4`开发的谷歌代理插件


### 前言
网上有很多关于谷歌插件开发的教程，不过很多都是教程都比较老，我自己对网上的一些教程并结合官方的最新文档开发了此插件。 
这里不记录API的使用，因为API以后可能会变化，这里只记录大概的开发原理和遇到的问题。具体的api使用参考官方文档  
官网文档：https://developer.chrome.com/docs/extensions/mv3/getstarted/


### 插件用途
在前端开发完成时，需要和后端联调接口。目前自己用到了两种方式：
 - 使用本地server代理请求。典型的就是使用devServer.proxy（https://webpack.docschina.org/configuration/dev-server/#devserverproxy）
 - 直接代理日常或测试环境的js到本地，直接在日常或测试环境调试

方式一是通过本地请求代理到测试环境的接口，接口环境变化时，本地需要修改代理并重新启动  
方式二是直接在日常环境上调试本地代码，接口环境变化时，不需要做修改，因为日常环境的js没有变化  
<br/>

此插件的作用就在于将日常或测试环境的js代理到本地，例如：
`http://www.test.com/  -> localhost:3000/`  
这样在测试环境里`http://www.test.com/main.js`就变成了`localhost:3000/main.js`

注意：测试环境和本地环境中打包到html里的js文件必须保持一致，这样代理才可以成功

### 开发记录

谷歌插件开发实际上就是js、css、html的组合，通过谷歌提供的一些api实现一些功能。下面是主要文件
```javascript

manifest.json
background.js
options.html
popup.html

```
`popup.html`和`options.html`是插件的交互页面，页面里可以引用自己的js和css。  
`background.js`是编写插件逻辑的文件，在这里我们可以拿到上面交互页面里的一些值，并在这里统一进行处理，比如网络请求的阻止和拦截操作。一些声明周期的监听事件等。
而`manifest.json`这个声明文件，就是告诉谷歌浏览器哪些是弹出框文件、后台页面和插件逻辑文件，当然还有一些如icon配置、权限配置等，具体配置可以参考谷歌插件官网。

此插件是使用`react+antd`开发。通过`babel`命令将jsx代码转换为普通js代码。命令行写在了`package.json`的`scripts`。babel监听src文件并将转化代码输出到js文件中。这里要注意presets使用的是`@babel/preset-react`而不是`react-app/prod `，因为`react-app/prod`不支持一些es7属性，导致babel在转换时会导入一些``Polyfill``来将ES7转ES5。而script标签里是不支持import等导入方式的(type/module可以但是Polyfill没有打包)，并且我们的`Polyfill`还是在`node_modules`里并没有打包。

