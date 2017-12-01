import template from './dashboard.html'
import Command from '../../range/command'

/**
 * Created by liuJD on 2017/11/10.
 */
export default {
    template,
    data() {
        return {
            videoUrl: '',
            upload: {
                status: 'ready', // progress,success,error,abort
                errorMsg: null,
                progressComputable: false,
                complete: 0
            },
            width: '',
            height: ''
        }
    },
    methods: {
        reset(){
            this.upload.status = 'ready'
        },
        insertVideoUrl() {
            if (!this.videoUrl) {
                return
            }
            this.$parent.execCommand(Command.INSERT_VIDEO, this.videoUrl)
            this.videoUrl = null
        },
        pick() {
            this.$refs.file.click()
        },
        setUploadError(msg = ''){
            this.upload.status = 'error'
            this.upload.errorMsg = msg && msg.toString()
        },
        setProgress(progress) {
            if (progress === 1) {
                this.upload.progressComputable = true
                return
            }
            this.upload.status = 'progress'
            this.upload.progressComputable = false
            this.upload.complete = (progress * 100).toFixed(2)
        },
        process() {
            const config = this.$options.module.config
            // compatibility with older format
            // {
            //     server: null,
            //     fieldName: 'image',
            //     compress: true,
            //     width: 1600,
            //     height: 1600,
            //     quality: 80
            // }
            // ----------- divider ----------------
            // {
            //     upload: {
            //         url: null,
            //         headers: {},
            //         params: {},
            //         fieldName: {}
            //     }
            // }
            if (!config.upload && !config.beforeUpload) {
                return this.setUploadError(this.$parent.locale['Miss required option'])
            }
            if (!config.upload && typeof config.server === 'string') {
                config.upload = {url: config.server}
            }
            if (config.upload && !config.upload.url) {
                config.upload = null
            }
            if (config.upload && typeof config.fieldName === 'string') {
                config.upload.fieldName = config.fieldName
            }

            const file = this.$refs.file.files[0]
            if (config.sizeLimit && file.size > config.sizeLimit) {
                this.setUploadError(this.$parent.locale['exceed size limit'])
                return
            }
            this.$refs.file.value = null
            const doPromise = Promise.resolve(
                config.beforeUpload && typeof config.beforeUpload === 'function'
                    ? config.beforeUpload.call(null, file, this.setProgress)
                    : null
            )

            const options = {
                width: this.width || config.width,
                height: this.height || config.height,
                controls: config.controls || true
            }
            doPromise
                .then((res) => {
                    this.reset()
                    if (typeof res === 'boolean' && res === false) {
                        return
                    }

                    // 如果钩子返回字符串，则当作是图片URL
                    if (typeof res === 'string') {
                        return this.$parent.execCommand(Command.INSERT_VIDEO, res, options)
                    }

                    return config.upload && this.uploadToServer(file)
                })
        },
        uploadToServer(file) {
            const config = this.$options.module.config

            const formData = new FormData()
            formData.append(config.upload.fieldName || 'video', file)

            if (typeof config.upload.params === 'object') {
                Object.keys(config.upload.params).forEach((key) => {
                    const value = config.upload.params[key]
                    if (Array.isArray(value)) {
                        value.forEach((v) => {
                            formData.append(key, v)
                        })
                    } else {
                        formData.append(key, value)
                    }
                })
            }

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
                if (xhr.status >= 300) {
                    this.setUploadError(`request error,code ${xhr.status}`)
                    return
                }

                try {
                    const url = config.uploadHandler(xhr.responseText)
                    if (url) {
                        this.$parent.execCommand(Command.INSERT_VIDEO, url)
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

            xhr.open('POST', config.upload.url)
            if (typeof config.upload.headers === 'object') {
                Object.keys(config.upload.headers).forEach((k) => {
                    xhr.setRequestHeader(k, config.upload.headers[k])
                })
            }
            xhr.send(formData)
        }
    }
}
