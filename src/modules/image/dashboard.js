import lrz from 'lrz'
import template from './dashboard.html'
import Command from '../../range/command'

/**
 * Created by peak on 2017/2/10.
 */
export default {
    template,
    data() {
        return {
            imageUrl: '',
            upload: {
                status: 'ready', // progress,success,error,abort
                errorMsg: null,
                progressComputable: false,
                complete: 0
            }
        }
    },
    methods: {
        reset(){
            this.upload.status = 'ready'
        },
        insertImageUrl() {
            if (!this.imageUrl) {
                return
            }
            this.$parent.execCommand(Command.INSERT_IMAGE, this.imageUrl)
            this.imageUrl = null
        },
        pick() {
            this.$refs.file.click()
        },
        setUploadError(msg){
            this.upload.status = 'error'
            this.upload.errorMsg = msg
        },
        startUpload() {
            const component = this
            const config = this.$options.module.config

            const file = this.$refs.file.files[0]
            if (file.size > config.sizeLimit) {
                this.setUploadError(this.$parent.locale['exceed size limit'])
                return
            }
            this.$refs.file.value = null

            // 需要压缩
            if (config.compress) {
                lrz(file, {
                    width: config.width,
                    height: config.height,
                    quality: config.quality,
                    fieldName: config.fieldName
                }).then((rst) => {
                    if (config.server) {
                        component.uploadToServer(rst.file)
                    } else {
                        component.insertBase64(rst.base64)
                    }
                }).catch((err) => {
                    this.setUploadError(err.toString())
                })
                return
            }
            // 不需要压缩
            // base64
            if (!config.server) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    component.insertBase64(e.target.result)
                }
                reader.readAsDataURL(file)
                return
            }
            // 上传服务器
            component.uploadToServer(file)
        },
        insertBase64(data) {
            this.$parent.execCommand(Command.INSERT_IMAGE, data)
        },
        uploadToServer(file) {
            const config = this.$options.module.config
            const formData = new FormData()
            formData.append(config.fieldName, file)

            const xhr = new XMLHttpRequest()

            xhr.onprogress = (e) => {
                this.upload.status = 'progress'
                if (e.lengthComputable) {
                    this.upload.progressComputable = true
                    const percentComplete = e.loaded / e.total
                    this.upload.complete = (percentComplete * 100).toFixed(2)
                } else {
                    this.upload.progressComputable = false
                }
            }

            xhr.onload = () => {
                if (xhr.status !== 200) {
                    this.setUploadError(`request error,code ${xhr.status}`)
                    return
                }

                try {
                    const url = config.uploadHandler(xhr.responseText)
                    if (url) {
                        this.$parent.execCommand(Command.INSERT_IMAGE, url)
                    }
                } catch (err) {
                    this.setUploadError(err.toString())
                } finally {
                    this.upload.status = 'ready'
                }
            }

            xhr.onerror = () => {
                // find network info in brower tools
                this.setUploadError('request error')
            }

            xhr.onabort = () => {
                this.upload.status = 'abort'
            }

            xhr.open('POST', config.server)
            xhr.send(formData)
        }
    }
}