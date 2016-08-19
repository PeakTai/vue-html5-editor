<style>
    .vue-html5-editor .color-card {
        margin: 2px;
        width: 30px;
        height: 30px;
        float: left;
        cursor: pointer;
    }
</style>
<template>
    <div>
        <label>
            <input type="radio" value="foreColor" v-model="command">&nbsp;
            {{$parent.locale["fore color"]}}
        </label>
        <label>
            <input type="radio" value="backColor" v-model="command">&nbsp;
            {{$parent.locale["background color"]}}
        </label>
    </div>
    <div>
        <div v-for="color in colors" :style="{'background-color':color}" class="color-card" @click="changeColor(color)">
        </div>
        <div style="clear: both"></div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                command: "foreColor",//backColor
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
                this.$parent.execCommand(this.command, color)
            }
        }
    }
</script>