<style>
    .vue-html5-editor .dashboard .dashboard-font {
        line-height: 36px;
    }
</style>
<template>
    <div class="dashboard-font">
        <div>
            <label>{{$parent.locale["heading"]}}:</label>
            <button v-for="h in 6" type="button" @click="setHeading(h+1)">H{{h+1}}</button>
        </div>
        <div>
            <label>
                {{$parent.locale["font name"]}}:
            </label>
            <button v-for="name in nameList" type="button" @click="setFontName(name)">{{name}}</button>
        </div>
        <div>
            <label>
                {{$parent.locale["font size"]}}:
            </label>
            <button v-for="size in 7" type="button" @click="setFontSize(size+1)">{{size+1}}</button>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                nameList: [
                    "Microsoft YaHei",
                    "Helvetica Neue",
                    "Helvetica",
                    "Arial",
                    "sans-serif",
                    "Verdana",
                    "Georgia",
                    "Times New Roman",
                    "Trebuchet MS",
                    "Microsoft JhengHei",
                    "Courier New",
                    "Impact",
                    "Comic Sans MS",
                    "Consolas"
                ]
            }
        },
        methods: {
            setFontName(name){
                this.$parent.execCommand("fontName", name)
            },
            setFontSize(size){
                this.$parent.execCommand("fontSize", size)
            },
            setHeading(heading){
                this.$parent.execCommand("formatBlock", "h" + heading)
            }
        }
    }
</script>