import editor from "./editor.vue";
import btns from "./buttons";
/**
 * 安装组件
 * @param Vue   {Vue}
 * @param options {Object} 选项,可配置按钮与图片上传
 */
exports.install = (Vue, options) => {
    //图片默认配置
    let image = {
        server: null,
        fieldName: "image",
        sizeLimit: 512 * 1024,//512k
        compress: true,
        width: 1600,
        height: 1600,
        quality: 80
    }
    options = options || {}
    image = Vue.util.extend(image, options.image || {})

    let component = Vue.extend(editor).extend({
        data () {
            return {btns, image}
        }
    })

    Vue.component(options.name || "html5-editor", component)
}