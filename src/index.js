import buildInModules from './modules/index'
import editor from './editor'
import i18nZhCn from './i18n/zh-cn'
import i18nEnUs from './i18n/en-us'
import mixin from './util/mixin'

/**
 * Vue html5 Editor
 * @param Vue   {Vue}
 * @param options {Object}
 */
class VueHtml5Editor {

    /**
     * build an editor component
     */
    constructor(options = {}) {
        let modules = [...buildInModules]
        const components = {}

        // extended modules
        if (Array.isArray(options.modules)) {
            options.modules.forEach((module) => {
                if (module.name) {
                    modules.push(module)
                }
            })
        }
        // hidden modules
        if (Array.isArray(options.hiddenModules)) {
            modules = (() => {
                const arr = []
                modules.forEach((m) => {
                    if (!options.hiddenModules.includes(m.name)) {
                        arr.push(m)
                    }
                })
                return arr
            })()
        }
        // visible modules
        if (Array.isArray(options.visibleModules)) {
            modules = (() => {
                const arr = []
                modules.forEach((module) => {
                    if (options.visibleModules.includes(module.name)) {
                        arr.push(module)
                    }
                })
                return arr
            })()
        }


        modules.forEach((module) => {
            // specify the config for each module in options by name
            const config = options[module.name]
            module.config = mixin(module.config, config)

            if (module.dashboard) {
                // $options.module
                module.dashboard.module = module
                components[`dashboard-${module.name}`] = module.dashboard
            }
            if (options.icons && options.icons[module.name]) {
                module.icon = options.icons[module.name]
            }

            module.hasDashboard = !!module.dashboard
            // prevent vue sync
            module.dashboard = null
        })

        // i18n
        const i18n = {'zh-cn': i18nZhCn, 'en-us': i18nEnUs}
        const customI18n = options.i18n || {}
        Object.keys(customI18n).forEach((key) => {
            i18n[key] = i18n[key] ? mixin(i18n[key], customI18n[key]) : customI18n[key]
        })
        const language = options.language || 'en-us'
        const locale = i18n[language]

        // ######################################
        const compo = mixin(editor, {
            data() {
                return {modules, locale}
            },
            components
        })
        mixin(this, compo)
    }

    /**
     * global install
     *
     * @param Vue
     * @param options
     */
    static install(Vue, options = {}) {
        Vue.component(options.name || 'vue-html5-editor', new VueHtml5Editor(options))
    }
}

export default VueHtml5Editor