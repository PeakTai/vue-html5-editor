# Intro

Vue-html5-editor is an html5 wysiwyg editor for vue,easy and flexible,compatible with Vue.js 1.0+.

![screenshot](http://tai.coding.me/vue-html5-editor/editor.png)

[demo is here](http://tai.coding.me/vue-html5-editor)

# Installation

### Npm


```bash
npm install vue-html5-editor --save-dev
```

import and install as global component

```js
var Vue = require("vue")
var editor = require("vue-html5-editor")
Vue.use(editor,options);
```

### browser

```html
<script src="serverpath/vue.js"></script>
<script src="serverpath/vue-html5-editor.js"></script>
```
Install using global variable `VueHtml5Editor`
```js
Vue.use(VueHtml5Editor, options)
```


# Usage

template code as follows

```html
<vue-html5-editor :content="content" :height="500"></vue-html5-editor>
```

# options

```js
Vue.use(VueHtml5Editor, {
    //global component name
    name: "vue-html5-editor",
    //custom icon class of built-in modules,default using font-awesome
    icons: {
        text: "fa fa-pencil",
        color: "fa fa-paint-brush",
        font: "fa fa-font",
        align: "fa fa-align-justify",
        list: "fa fa-list",
        link: "fa fa-chain",
        unlink: "fa fa-chain-broken",
        tabulation: "fa fa-table",
        image: "fa fa-file-image-o",
        hr: "fa fa-minus",
        eraser: "fa fa-eraser",
        undo: "fa-undo fa",
        "full-screen": "fa fa-arrows-alt",
        info: "fa fa-info",
    },
    //config image module
    image: {
        //Url of the server-side,default null and convert image to base64
        //return json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
        server: null,
        //the name for file field in multipart request
        fieldName: "image",
        //max file size
        sizeLimit: 512 * 1024,
        // default true,if set to true,the image will resize by localResizeIMG (https://github.com/think2011/localResizeIMG)
        compress: true,
        //follows are options of localResizeIMG
        width: 1600,
        height: 1600,
        quality: 80
    },
    //default en-us, en-us and zh-cn are built-in
    language: "zh-cn",
    i18n: {
        //specify your language here
        "zh-cn": {
            "align": "对齐方式",
            "image": "图片",
            "list": "列表",
            "link": "链接",
            "unlink": "去除链接",
            "table": "表格",
            "font": "文字",
            "full screen": "全屏",
            "text": "排版",
            "eraser": "格式清除",
            "info": "关于",
            "color": "颜色",
            "please enter a url": "请输入地址",
            "create link": "创建链接",
            "bold": "加粗",
            "italic": "倾斜",
            "underline": "下划线",
            "strike through": "删除线",
            "subscript": "上标",
            "superscript": "下标",
            "heading": "标题",
            "font name": "字体",
            "font size": "文字大小",
            "left justify": "左对齐",
            "center justify": "居中",
            "right justify": "右对齐",
            "ordered list": "有序列表",
            "unordered list": "无序列表",
            "fore color": "前景色",
            "background color": "背景色",
            "row count": "行数",
            "column count": "列数",
            "save": "确定",
            "upload": "上传",
            "progress": "进度",
            "unknown": "未知",
            "please wait": "请稍等",
            "error": "错误",
            "abort": "中断",
            "reset": "重置"
        }
    },
    //extended modules
    modules: {
        //omit,reference to source code of build-in modules
    }

})
```

# attributes of component

```html
<editor :content.sync="content" :height="500" :z-index="1000" :auto-height="true"></editor>
```

### content

Content to edit,need  two-way binding

### height

The height or min-height ( if auto-height is true ) of editor

### z-index

Sets z-index style property of editor

### auto-height

Resize editor height Automatically

# License
[Apache-2.0](http://opensource.org/licenses/Apache-2.0)
