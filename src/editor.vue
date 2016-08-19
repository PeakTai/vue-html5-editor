<style lang="less" src="./style.less"></style>
<template>
    <div class="vue-html5-editor" :style="{'z-index':zIndex}" :class="{'full-screen':fullScreen}">
        <div class="toolbar" :style="{'z-index':zIndex+1}" v-el:toolbar>
            <ul>
                <li v-for="module in modules" v-if="module.show" :title="locale[module.i18n]"
                    @click="activeModule(module)">
                    <span class="icon" :class="module.icon"></span>
                </li>
            </ul>
            <div class="dashboard" v-show="dashboard" :style="dashboardStyle">
                <div v-if="dashboard" :is="dashboard" keep-alive></div>
            </div>
        </div>
        <div class="content" v-el:content contenteditable="true" @click="toggleDashboard(dashboard)"
             :style="contentStyle">
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            content: {
                twoWay: true,
                type: String,
                required: true,
                default: ""
            },
            height: {
                type: Number,
                default: 300,
                validator (val) {
                    return val >= 300
                }
            },
            zIndex: {
                type: Number,
                default: 1000
            },
            autoHeight: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                //locale: {},
                fullScreen: false,
                dashboard: null,
                dashboardStyle: {},
            }
        },
        watch: {
            content(val) {
                let content = this.$els.content.innerHTML
                if (val != content) {
                    this.$els.content.innerHTML = val
                }
            },
            dashboard(val){
                if (val) {
                    this.computeDashboardStyle()
                }
            },
            fullScreen(val){
                let component = this
                component.$nextTick(function () {
                    component.computeDashboardStyle()
                })
                if (val) {
                    component.parentEl = component.$el.parentNode
                    component.nextEl = component.$el.nextSibling
                    component.$appendTo(document.body)
                    return
                }
                if (component.nextEl) {
                    component.$before(component.nextEl)
                    return
                }
                component.$appendTo(component.parentEl)
            }
        }
        ,
        computed: {
            contentStyle(){
                let style = {}
                if (this.fullScreen) {
                    style.height = window.innerHeight - (this.$els.toolbar.clientHeight + 1) + "px"
                    return style
                }
                if (!this.autoHeight) {
                    style.height = this.height + 'px'
                    return style
                }
                style["min-height"] = this.height + 'px'
                return style
            }
        },
        methods: {
            computeDashboardStyle(){
                this.dashboardStyle = {'max-height': this.$els.content.clientHeight + 'px'}
            },
            toggleFullScreen(){
                this.fullScreen = !this.fullScreen
            },
            toggleDashboard(dashboard){
                this.dashboard == dashboard ? this.dashboard = null : this.dashboard = dashboard
            },
            execCommand(command, arg){
                this.restoreSelection()
                document.execCommand(command, false, arg)
                this.content = this.$els.content.innerHTML
                this.dashboard = null
            },
            getCurrentRange(){
                let selection = window.getSelection()
                return selection.rangeCount ? selection.getRangeAt(0) : null
            },
            saveCurrentRange(){
                let range = this.getCurrentRange()
                if (!range) {
                    return
                }
                if (this.$els.content.contains(range.startContainer) &&
                        this.$els.content.contains(range.endContainer)) {
                    this.range = range
                }
            },
            restoreSelection(){
                let selection = window.getSelection()
                selection.removeAllRanges()
                if (this.range) {
                    selection.addRange(this.range)
                } else {
                    let content = this.$els.content
                    let div = document.createElement("div")
                    let range = document.createRange()
                    content.appendChild(div)
                    range.setStart(div, 0)
                    range.setEnd(div, 0)
                    selection.addRange(range)
                }
            },
            activeModule(module){
                if (typeof module.handler == "function") {
                    module.handler(this)
                    return
                }
                if (module.hasDashboard) {
                    this.toggleDashboard(module.name)
                }
            }
        },
        compiled(){
            let editor = this
            editor.modules.forEach(function (module) {
                if (typeof module.init == "function") {
                    module.init(editor)
                }
            })
        },
        ready(){
            let component = this
            let content = component.$els.content
            content.innerHTML = component.content
            content.addEventListener("mouseup", component.saveCurrentRange, false)
            content.addEventListener("keyup", component.saveCurrentRange, false)
            content.addEventListener("mouseout", component.saveCurrentRange, false)
            content.addEventListener("keyup", function () {
                component.content = component.$els.content.innerHTML
            }, false)

            component.touchHander = function (e) {
                let isInside = (component.$els.content.contains(e.target))
                let currentRange = component.getCurrentRange()
                let clear = currentRange && (currentRange.startContainer === currentRange.endContainer
                        && currentRange.startOffset === currentRange.endOffset);
                if (!clear || isInside) {
                    component.saveCurrentRange()
                }
            }

            window.addEventListener("touchend", component.touchHander, false)
        },
        beforeDestroy(){
            let editor = this
            window.removeEventListener("touchend", editor.touchHander)
            editor.modules.forEach(function (module) {
                if (typeof module.destroyed == "function") {
                    module.destroyed(editor)
                }
            })
        }
    }
</script>