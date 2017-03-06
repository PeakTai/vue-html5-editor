/**
 * unlink
 * Created by peak on 16/8/18.
 */
export default {
    name: 'unlink',
    icon: 'fa fa-chain-broken',
    i18n: 'unlink',
    handler(editor) {
        editor.execCommand('unlink')
    }
}