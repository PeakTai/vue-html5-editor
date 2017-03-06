/**
 * remove format of selection
 * Created by peak on 16/8/18.
 */
export default {
    name: 'eraser',
    icon: 'fa fa-eraser',
    i18n: 'eraser',
    handler(editor) {
        editor.execCommand('removeFormat')
    }
}
