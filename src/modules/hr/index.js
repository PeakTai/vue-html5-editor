/**
 * hr
 * Created by peak on 16/8/20.
 */
export default {
    name: "hr",
    icon: "fa fa-minus",
    show: true,
    i18n: "hr",
    handler (editor) {
        editor.execCommand("insertHorizontalRule")
    },
    // init (editor) {
    //
    // },
    // destroyed(editor){
    //
    // },
}
