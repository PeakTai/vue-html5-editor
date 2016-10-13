import editor from "./editor.vue";
import moduleText from "./modules/text/index";
import moduleFont from "./modules/font/index";
import moduleColor from "./modules/color/index";
import moduleAlign from "./modules/align/index";
import moduleList from "./modules/list/index";
import moduleLink from "./modules/link/index";
import moduleUnlink from "./modules/unlink/index";
import moduleTable from "./modules/table/index";
import moduleImage from "./modules/image/index";
import moduleHr from "./modules/hr";
import moduleEraser from "./modules/eraser/index";
import moduleUndo from "./modules/undo/index";
import moduleFullScreen from "./modules/full-screen/index";
import moduleInfo from "./modules/info/index";
import i18nZhCn from "./i18n/zh-cn";
import i18nEnUs from "./i18n/en-us";
import arrayFill from "./array-polyfill";

/**
 * install
 * @param Vue   {Vue}
 * @param options {Object}
 */
exports.install = (Vue, options) => {

    arrayFill()

    options = options || {}

    //modules
    let modules = [
        moduleText,
        moduleColor,
        moduleFont,
        moduleAlign,
        moduleList,
        moduleLink,
        moduleUnlink,
        moduleTable,
        moduleImage,
        moduleHr,
        moduleEraser,
        moduleUndo,
        moduleFullScreen,
        moduleInfo
    ]
    //extended modules
    if (Array.isArray(options.modules)) {
        let arr = []
        options.modules.forEach(function (module) {
            if (module.name) {
                arr.push(module)
            }
        })
        modules = modules.concat(arr)
    }
    //hidden modules
    if (Array.isArray(options.hiddenModules)) {
        modules = (()=> {
            let arr = []
            modules.forEach(function (m) {
                if (!options.hiddenModules.includes(m.name)) {
                    arr.push(m)
                }
            })
            return arr
        })()
    }
    //visible modules
    if (Array.isArray(options.visibleModules)) {
        modules = (()=> {
            let arr = []
            options.visibleModules.forEach(function (name) {
                modules.forEach(function (module) {
                    if (module.name == name) {
                        arr.push(module)
                    }
                })
            })
            return arr
        })()
    }


    let components = {}
    modules.forEach((module)=> {

        //specify the config for each module in options by name
        let config = options[module.name]
        module.config = Vue.util.extend(module.config || {}, config || {})

        if (module.dashboard) {
            //$options.module
            module.dashboard.module = module
            components['dashboard-' + module.name] = module.dashboard
        }
        if (options.icons && options.icons[module.name]) {
            module.icon = options.icons[module.name]
        }

        module.hasDashboard = !!module.dashboard
        //prevent vue sync
        module.dashboard = null
    })

    //i18n
    let i18n = {"zh-cn": i18nZhCn, "en-us": i18nEnUs}
    let customI18n = options.i18n || {}
    Object.keys(customI18n).forEach((key)=> {
        i18n[key] = i18n[key] ? Vue.util.extend(i18n[key], customI18n[key]) : customI18n[key]
    })
    let language = options.language || "en-us"
    let locale = i18n[language] || i18n["en-us"]


    let component = Vue.extend(editor).extend({
        data () {
            return {modules, locale}
        },
        components
    })

    Vue.component(options.name || "vue-html5-editor", component)
}