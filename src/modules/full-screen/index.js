/**
 * toggle full screen mode
 * Created by peak on 16/8/18.
 */
export default  {
    name: "full-screen",
    icon: "fa fa-arrows-alt",
    i18n: "full screen",
    show: true,
    handler (editor) {
        editor.toggleFullScreen()
    }
}
