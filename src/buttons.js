export default [
    {
        name: "bold",
        title: "加粗",
        icon: require("./icon/bold.jpg"),
        action: "execCommand",
        arg: "bold"
    },
    {
        name: "italic",
        title: "倾斜",
        icon: require("./icon/italic.jpg"),
        action: "execCommand",
        arg: "italic"
    },
    {
        name: "underline",
        title: "下划线",
        icon: require("./icon/underline.jpg"),
        action: "execCommand",
        arg: "underline"
    },
    {
        name: "color",
        title: "文字颜色",
        icon: require("./icon/color.jpg"),
        action: "toggleDashboard",
        arg: "color"
    },
    {
        name: "link",
        title: "加链接",
        icon: require("./icon/link.jpg"),
        action: "toggleDashboard",
        arg: "link"
    },
    {
        name: "unlink",
        title: "去除链接",
        icon: require("./icon/unlink.jpg"),
        action: "execCommand",
        arg: "unlink"
    },
    {
        name: "insertOrderedList",
        title: "有序列表",
        icon: require("./icon/list-ol.jpg"),
        action: "execCommand",
        arg: "insertOrderedList"
    },
    {
        name: "insertUnorderedList",
        title: "无序列表",
        icon: require("./icon/list-ul.jpg"),
        action: "execCommand",
        arg: "insertUnorderedList"
    },
    {
        name: "insertHorizontalRule",
        title: "分隔线",
        icon: require("./icon/hr.jpg"),
        action: "execCommand",
        arg: "insertHorizontalRule"
    },
    {
        name: "table",
        title: "表格",
        icon: require("./icon/table.jpg"),
        action: "toggleDashboard",
        arg: "table"
    },
    {
        name: "image",
        title: "图片",
        icon: require("./icon/image.jpg"),
        action: "toggleDashboard",
        arg: "image"
    },
    {
        name: "removeFormat",
        title: "擦除格式",
        icon: require("./icon/eraser.jpg"),
        action: "execCommand",
        arg: "removeFormat"
    },
    {
        name: "undo",
        title: "撤消",
        icon: require("./icon/undo.jpg"),
        action: "execCommand",
        arg: "undo"
    }
]
