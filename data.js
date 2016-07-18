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
    },
    //图标配置,编辑器默认使用fontawesome图标,需要引入依赖
    icons: {
        //加粗
        bold: "fa fa-bold",
        //倾斜
        italic: "fa fa-italic",
        //下划线
        underline: "fa fa-underline",
        //颜色
        color: "fa fa-pencil",
        //链接
        link: "fa fa-link",
        //取消链接
        unlink: "fa fa-chain-broken",
        //有序列表
        ol: "fa fa-list-ol",
        //无序列表
        ul: "fa fa-list-ul",
        //水平分隔线
        hr: "fa fa-minus",
        //表格
        table: "fa fa-table",
        //图片
        image: "fa fa-file-image-o",
        //格式清除
        eraser: "fa fa-eraser",
        //撤回
        undo: "fa fa-undo",
        //全屏
        fullScreen: "fa fa-arrows-alt"
    }
})