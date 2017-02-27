/**
 * Created by peak on 2017/2/24.
 */
/**
 * shadow clone
 *
 * @param source    source object
 * @param ext       extended object
 */
export default function mixin(source = {}, ext = {}) {
    Object.keys(ext).forEach((k) => {
        // for data function
        if (k === 'data') {
            const dataSrc = source[k]
            const dataDesc = ext[k]
            if (typeof dataDesc === 'function') {
                if (typeof dataSrc !== 'function') {
                    source[k] = dataDesc
                } else {
                    source[k] = () => mixin(dataSrc(), dataDesc())
                }
            }
        } else {
            source[k] = ext[k]
        }
    })
    return source
}