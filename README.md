# vue-html5-editor

一个vue的html5富文本编辑器插件，简洁易用

![编辑器图片](http://tai.coding.me/vue-html5-editor/editor.png)

[查看在线演示](http://tai.coding.me/vue-html5-editor/server-upload.html)

## 安装并使用

#### nodejs

```bash
npm install vue-html5-editor --save-dev
```

```js
var editor = require("vue-html5-editor")
Vue.use(editor,options);
```

### 浏览器

```html
<script src="serverpath/vue-html5-editor.js"></script>
```
引入了js后，会有一个全局变量`VueHtml5Editor`

```js
Vue.use(VueHtml5Editor, { name : "editor"})
```
模板示例代码

```html
<editor :content="content" :height="500"></editor>
```
### 全局安装选项

```js
Vue.use(VueHtml5Editor, {
    //全局组件的名称
    name: "editor",
    //图片相关配置
    image: {
        //服务器上传地址
	    //服务器需要返回json数据类似 {ok:false,msg:"错误信息"} 或者 {ok:true,data:"图片地址"}
        server: null,
        //图片上传请求参数名称
        fieldName: "image",
        //大小限制,默认512k
        sizeLimit: 512 * 1024,
        //是否压缩,如果设置为false,后面3个参数无用
        compress: true,
        //压缩后的最大宽度
        width: 1600,
        //压缩后的最大高度
        height: 1600,
        //jpeg质量
        quality: 80
    }
})
```

### 编辑器组件属性

```html
<editor :content.sync="content" :height="500" :z-index="1000" :disable-full-screen="false"></editor>
```

#### content

编辑内容，需要双向同步，字符串类型

#### height

编辑器高度，单位像素，数值型

### z-index

编辑器的显示层级

### disable-full-screen

是否禁用全屏功能

