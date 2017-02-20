import template from './dashboard.html'

/**
 * Created by peak on 2017/2/10.
 */
export default {
    template,
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
            if (this.rows < 2 || this.rows > 10) {
                return
            }
            if (this.cols < 2 || this.cols > 10) {
                return
            }
            let table = '<table style="border-spacing: 0px; border-collapse: collapse; width: 100%; max-width: 100%; margin-bottom: 0px; border: 1px solid rgb(221, 221, 221); color: rgb(51, 51, 51); font-size: 14px; line-height: 20px; background-color: transparent;"><tbody>'
            for (let i = 0; i < this.rows; i++) {
                table += '<tr>'
                for (let j = 0; j < this.cols; j++) {
                    table += '<td style="padding: 8px; line-height: 1.42857; vertical-align: top; border: 1px solid rgb(221, 221, 221);">&nbsp;</td>'
                }
                table += '</tr>'
            }
            table += '</tbody></table>'
            this.$parent.execCommand('insertHTML', table)
        }
    }
}