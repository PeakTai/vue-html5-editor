/**
 * undo
 * Created by peak on 16/8/20.
 */
export default {
    name: 'undo',
    icon: 'fa-undo fa',
    i18n: 'undo',
    handler(editor) {
        editor.execCommand('undo')
    }
}

