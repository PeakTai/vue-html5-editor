// import lrz from 'lrz'
import template from './dashboard.html'

/**
 * Created by peak on 2017/2/10.
 */
export default {
    template
    // data() {
    //     return {
    //         url: '',
    //         upload: {
    //             status: 'ready', // progress,success,error,abort
    //             errmsg: null,
    //             progressComputable: false,
    //             complete: 0
    //         }
    //
    //     }
    // },
    // methods: {
    //     reset(){
    //         this.upload.status = 'ready'
    //     },
    //     pick() {
    //         this.$els.file.click()
    //     },
    //     insertImage(e) {
    //         e.preventDefault()
    //         if (!this.url) {
    //             return
    //         }
    //         this.$parent.execCommand('insertImage', this.url)
    //         this.url = null
    //     },
    //     selectFile() {
    //         const component = this
    //         const config = component.$options.module.config
    //
    //         const file = this.$els.file.files[0]
    //         if (file.size > config.size_limit) {
    //             const prompt = component.$parent.locale['exceed size limit']
    //             component.upload.status = 'error'
    //             component.errmsg = prompt
    //             return
    //         }
    //         component.$els.file.value = null
    //         // 需要压缩
    //         if (config.compress) {
    //             lrz(file, {
    //                 width: config.width,
    //                 height: config.height,
    //                 quality: config.quality,
    //                 fieldName: config.fieldName
    //             }).then((rst) => {
    //                 if (config.server) {
    //                     component.uploadFile(rst.file)
    //                 } else {
    //                     component.insertBase64(rst.base64)
    //                 }
    //             }).catch((err) => {
    //                 component.upload.status = 'error'
    //                 console.log('upload error', err)
    //             })
    //             return
    //         }
    //         // 不需要压缩
    //         // base64
    //         if (!config.server) {
    //             const reader = new FileReader()
    //             reader.onload = function (e) {
    //                 component.insertBase64(e.target.result)
    //             }
    //             reader.readAsDataURL(file)
    //             return
    //         }
    //         // 上传服务器
    //         component.uploadFile(file)
    //     },
    //     insertBase64(data) {
    //         this.$parent.execCommand('insertimage', data)
    //     },
    //     uploadFile(file) {
    //         const component = this
    //         const config = component.$options.module.config
    //         const formData = new FormData()
    //         formData.append(config.fieldName, file)
    //         const xhr = new XMLHttpRequest()
    //         xhr.onprogress = function (e) {
    //             component.upload.status = 'progress'
    //             if (e.lengthComputable) {
    //                 component.upload.progressComputable = true
    //                 const percentComplete = e.loaded / e.total
    //                 component.upload.complete = (percentComplete * 100).toFixed(2)
    //             } else {
    //                 component.upload.progressComputable = false
    //             }
    //         }
    //         xhr.onload = function (e) {
    //             if (xhr.status != 200) {
    //                 component.upload.status = 'error'
    //                 console.log('upload error', e)
    //                 return
    //             }
    //             component.upload.status = 'success'
    //             try {
    //                 const url = config.uploadHandler(xhr.responseText)
    //                 if (url) {
    //                     component.$parent.execCommand('insertImage', url)
    //                 }
    //             } catch (e) {
    //                 console.error(e)
    //             } finally {
    //                 component.upload.status = 'ready'
    //             }
    //         }
    //         xhr.onerror = function (e) {
    //             component.upload.status = 'error'
    //             console.log('upload error', e)
    //         }
    //         xhr.onabort = function (e) {
    //             component.upload.status = 'abort'
    //             console.log('upload abort', e)
    //         }
    //         xhr.open('POST', config.server)
    //         xhr.send(formData)
    //     }
    // }
}