<template>
    <form @submit.prevent="insertTable">
        <label>
            {{$parent.locale["row count"]}}
            <input type="number" style="width: 60px" maxlength="2" min="2" max="10" v-model="rows">
        </label>
        <label>
            {{$parent.locale["column count"]}}
            <input type="number" style="width: 60px" maxlength="2" min="2" max="10" v-model="cols">
        </label>

        <button type="submit">{{$parent.locale.save}}</button>
    </form>
</template>
<script>
    export default {
        data(){
            return {
                rows: 2,
                cols: 2,
                hasHead: false,
                striped: false,
                hover: false
            }
        },
        methods: {
            insertTable(){
                let component = this
                if (component.rows < 2 || component.rows > 10) {
                    return
                }
                if (component.cols < 2 || component.cols > 10) {
                    return
                }
                let table = "<table style='border-spacing: 0px; border-collapse: collapse; width: 100%; max-width: 100%; margin-bottom: 0px; border: 1px solid rgb(221, 221, 221); color: rgb(51, 51, 51); font-size: 14px; line-height: 20px; background-color: transparent;'><tbody>"
                for (let i = 0; i < component.rows; i++) {
                    table += "<tr>"
                    for (let j = 0; j < component.cols; j++) {
                        table += "<td style='padding: 8px; line-height: 1.42857; vertical-align: top; border: 1px solid rgb(221, 221, 221);'>&nbsp;</td>"
                    }
                    table += "</tr>"
                }
                table += "</tbody></table>"
                component.$parent.execCommand("insertHTML", table)
            }
        }
    }
</script>

