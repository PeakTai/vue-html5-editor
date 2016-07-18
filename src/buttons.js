export default [
    {
        name: "bold",
        title: "加粗",
        action: "execCommand",
        arg: "bold"
    },
    {
        name: "italic",
        title: "倾斜",
        action: "execCommand",
        arg: "italic"
    },
    {
        name: "underline",
        title: "下划线",
        action: "execCommand",
        arg: "underline"
    },
    {
        name: "color",
        title: "文字颜色",
        action: "toggleDashboard",
        arg: "color"
    },
    {
        name: "link",
        title: "加链接",
        action: "toggleDashboard",
        arg: "link"
    },
    {
        name: "unlink",
        title: "去除链接",
        action: "execCommand",
        arg: "unlink"
    },
    {
        name: "ol",
        title: "有序列表",
        action: "execCommand",
        arg: "insertOrderedList"
    },
    {
        name: "ul",
        title: "无序列表",
        action: "execCommand",
        arg: "insertUnorderedList"
    },
    {
        name: "hr",
        title: "分隔线",
        action: "execCommand",
        arg: "insertHorizontalRule"
    },
    {
        name: "table",
        title: "表格",
        action: "toggleDashboard",
        arg: "table"
    },
    {
        name: "image",
        title: "图片",
        action: "toggleDashboard",
        arg: "image"
    },
    {
        name: "eraser",
        title: "擦除格式",
        action: "execCommand",
        arg: "removeFormat"
    },
    {
        name: "undo",
        title: "撤消",
        action: "execCommand",
        arg: "undo"
    }
]
