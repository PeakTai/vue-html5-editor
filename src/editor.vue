<style lang="less" src="./style.less"></style>
<template src="./template.html"></template>
<script>
    import dashboardColor from "./dashboard/color.vue"
    import dashboardImage from "./dashboard/image.vue"
    import dashboardLink from "./dashboard/link.vue"
    import dashboardTable from "./dashboard/table.vue"


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
            disableFullScreen: {
                type: Boolean,
                default: false
            },
            autoHeight: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                fullScreen: false,
                dashboard: null,
                dashboardStyle: {}
            }
        },
        watch: {
            content(val) {
                var content = this.$els.content.innerHTML
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
                var component = this
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
            contentStyle()
            {
                var style = {}
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
        }
        ,
        methods: {
            computeDashboardStyle()
            {
                this.dashboardStyle = {'max-height': this.$els.content.clientHeight + 'px'}
            }
            ,
            toggleDashboard(dashboard)
            {
                this.dashboard == dashboard ? this.dashboard = null : this.dashboard = dashboard
            }
            ,
            execCommand(command, arg)
            {
                this.restoreSelection()
                document.execCommand(command, false, arg)
                this.content = this.$els.content.innerHTML
                this.dashboard = null
            }
            ,
            getCurrentRange()
            {
                var selection = window.getSelection()
                return selection.rangeCount ? selection.getRangeAt(0) : null
            }
            ,
            saveCurrentRange()
            {
                var range = this.getCurrentRange()
                if (!range) {
                    return
                }
                if (this.$els.content.contains(range.startContainer) &&
                        this.$els.content.contains(range.endContainer)) {
                    this.range = range
                }
            }
            ,
            restoreSelection()
            {
                var selection = window.getSelection()
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
            }
        }
        ,
        ready()
        {
            var component = this
            var content = component.$els.content
            content.innerHTML = component.content
            content.addEventListener("mouseup", component.saveCurrentRange, false)
            content.addEventListener("keyup", component.saveCurrentRange, false)
            content.addEventListener("mouseout", component.saveCurrentRange, false)
            content.addEventListener("keyup", function () {
                component.content = component.$els.content.innerHTML
            }, false)

            component.touchHander = function (e) {
                var isInside = (component.$els.content.contains(e.target))
                var currentRange = component.getCurrentRange()
                var clear = currentRange && (currentRange.startContainer === currentRange.endContainer
                        && currentRange.startOffset === currentRange.endOffset);
                if (!clear || isInside) {
                    component.saveCurrentRange()
                }
            }

            window.addEventListener("touchend", component.touchHander, false)
        }
        ,
        beforeDestroy()
        {
            window.removeEventListener("touchend", this.touchHander)
        }
        ,
        components: {
            "dashboard-color": dashboardColor,
            "dashboard-image": dashboardImage,
            "dashboard-link": dashboardLink,
            "dashboard-table": dashboardTable
        }
    }
</script>