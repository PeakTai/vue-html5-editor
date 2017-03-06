import RangeHandler from './range/handler'
import './style.css'
import template from './editor.html'
/**
 * Created by peak on 2017/2/9.
 */
export default {
    template,
    props: {
        content: {
            type: String,
            required: true,
            default: ''
        },
        height: {
            type: Number,
            default: 300,
            validator(val){
                return val >= 100
            }
        },
        zIndex: {
            type: Number,
            default: 1000
        },
        autoHeight: {
            type: Boolean,
            default: true
        },
        showModuleName: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            // defaultShowModuleName:false
            // locale: {},
            // modules:{},
            fullScreen: false,
            dashboard: null,
            dashboardStyle: {}
        }
    },
    watch: {
        content(val) {
            const content = this.$refs.content.innerHTML
            if (val !== content) {
                this.$res.content.innerHTML = val
            }
        },
        fullScreen(val){
            const component = this
            if (val) {
                component.parentEl = component.$el.parentNode
                component.nextEl = component.$el.nextSibling
                document.body.appendChild(component.$el)
                return
            }
            if (component.nextEl) {
                component.parentEl.insertBefore(component.$el, component.nextEl)
                return
            }
            component.parentEl.appendChild(component.$el)
        }
    },
    computed: {
        contentStyle(){
            const style = {}
            if (this.fullScreen) {
                style.height = `${window.innerHeight - this.$refs.toolbar.clientHeight - 1}px`
                return style
            }
            if (!this.autoHeight) {
                style.height = `${this.height}px`
                return style
            }
            style['min-height'] = `${this.height}px`
            return style
        }
    },
    methods: {
        toggleFullScreen(){
            this.fullScreen = !this.fullScreen
        },
        enableFullScreen(){
            this.fullScreen = true
        },
        exitFullScreen(){
            this.fullScreen = false
        },
        focus(){
            this.$refs.content.focus()
        },
        toggleDashboard(dashboard){
            this.dashboard = this.dashboard === dashboard ? null : dashboard
        },
        execCommand(command, arg){
            this.restoreSelection()
            if (this.range) {
                new RangeHandler(this.range).execCommand(command, arg)
            }
            this.toggleDashboard()
            this.$emit('change', this.$refs.content.innerHTML)
        },
        getCurrentRange(){
            return this.range
        },
        saveCurrentRange(){
            const selection = window.getSelection ? window.getSelection() : document.getSelection()
            const range = selection.rangeCount ? selection.getRangeAt(0) : null
            if (!range) {
                return
            }
            if (this.$refs.content.contains(range.startContainer) &&
                this.$refs.content.contains(range.endContainer)) {
                this.range = range
            }
        },
        restoreSelection(){
            const selection = window.getSelection ? window.getSelection() : document.getSelection()
            selection.removeAllRanges()
            if (this.range) {
                selection.addRange(this.range)
            } else {
                const content = this.$refs.content
                const div = document.createElement('div')
                const range = document.createRange()
                content.appendChild(div)
                range.setStart(div, 0)
                range.setEnd(div, 0)
                selection.addRange(range)
                this.range = range
            }
        },
        activeModule(module){
            if (typeof module.handler === 'function') {
                module.handler(this)
                return
            }
            if (module.hasDashboard) {
                this.toggleDashboard(`dashboard-${module.name}`)
            }
        }
    },
    created(){
        this.modules.forEach((module) => {
            if (typeof module.init === 'function') {
                module.init(this)
            }
        })
    },
    mounted(){
        const content = this.$refs.content
        content.innerHTML = this.content
        content.addEventListener('mouseup', this.saveCurrentRange, false)
        content.addEventListener('keyup', this.saveCurrentRange, false)
        content.addEventListener('mouseout', this.saveCurrentRange, false)
        content.addEventListener('keyup', () => {
            this.$emit('change', content.innerHTML)
        }, false)

        this.touchHandler = (e) => {
            if (content.contains(e.target)) {
                this.saveCurrentRange()
            }
        }

        window.addEventListener('touchend', this.touchHandler, false)
    },
    updated(){
        this.dashboardStyle = {'max-height': `${this.$refs.content.clientHeight}px`}
    },
    beforeDestroy(){
        window.removeEventListener('touchend', this.touchHandler)
        this.modules.forEach((module) => {
            if (typeof module.destroyed === 'function') {
                module.destroyed(this)
            }
        })
    }
}