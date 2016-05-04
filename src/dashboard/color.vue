<style lang="less" src="./color.less"></style>
<template>
    <div>
        <div v-for="color in colors" :style="{'background-color':color}" class="color-card" @click="changeColor(color)">
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                colors: [
                    "#000000", "#000033", "#000066", "#000099", "#003300", "#003333", "#003366",
                    "#003399", "#006600", "#006633", "#009900", "#330000", "#330033", "#330066",
                    "#333300", "#333366", "#660000", "#660033", "#663300", "#666600", "#666633",
                    "#666666", "#666699", "#990000", "#990033", "#9900CC", "#996600", "#FFCC00",
                    "#FFCCCC", "#FFCC99", "#FFFF00", "#FF9900", "#CCFFCC", "#CCFFFF", "#CCFF99"
                ]
            }
        },
        methods: {
            changeColor(color){
                var parent = this.$parent
                parent.execCommand("foreColor", color)
            }
        }
    }
</script>