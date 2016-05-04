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
            }
        },
        data () {
            return {
                fullScreen: false,
                dashboard: null
            }
        },
        watch: {
            content(val) {
                var content = this.$els.content.innerHTML
                if (val != content) {
                    this.$els.content.innerHTML = val
                }
            }
        },
        computed: {
            contentHeight () {
                if (!this.fullScreen) {
                    return this.height
                }
                return window.innerHeight - (this.$els.toolbar.clientHeight + 1)

            }
        },
        methods: {
            toggleDashboard (dashboard) {
                if (this.loading) {
                    return
                }
                this.dashboard == dashboard ? this.dashboard = null : this.dashboard = dashboard
            },
            execCommand (command, arg) {
                if (this.loading) {
                    return
                }
                this.restoreSelection()
                document.execCommand(command, false, arg)
                this.content = this.$els.content.innerHTML
                this.dashboard = null
            },
            getCurrentRange () {
                var selection = window.getSelection()
                return selection.rangeCount ? selection.getRangeAt(0) : null
            },
            saveCurrentRange() {
                var range = this.getCurrentRange()
                if (!range) {
                    return
                }
                if (this.$els.content.contains(range.startContainer) &&
                        this.$els.content.contains(range.endContainer)) {
                    this.range = range
                }
            },
            restoreSelection () {
                var selection = window.getSelection()
                selection.removeAllRanges()
                if (this.range) {
                    selection.addRange(this.range)
                }
            }
        },
        ready () {
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
        },
        beforeDestroy () {
            window.removeEventListener("touchend", this.touchHander)
        },
        components: {
            "dashboard-color": dashboardColor,
            "dashboard-image": dashboardImage,
            "dashboard-link": dashboardLink,
            "dashboard-table": dashboardTable
        }
    }
</script>