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
            height: '',
            width: '',
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
        insertImageUrl(e, url) {
            this.imageUrl = url || this.imageUrl
            if (!this.imageUrl) {
                return
            }
            this.$parent.execCommand(Command.INSERT_IMAGE, {
                url: this.imageUrl, width: this.width, height: this.height
            })
            this.imageUrl = null
        },
        pick() {
            this.$refs.file.click()
        },
        setUploadError(msg = ''){
            this.upload.status = 'error'
            this.upload.errorMsg = msg && msg.toString()
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
            //     },
            //     compress: {
            //         width: 1600,
            //         height: 1600,
            //         quality: 80
            //     },
            // }

            if (!config.upload && typeof config.server === 'string') {
                config.upload = {url: config.server}
            }
            if (config.upload && !config.upload.url) {
                config.upload = null
            }
            if (config.upload && typeof config.fieldName === 'string') {
                config.upload.fieldName = config.fieldName
            }
            if (typeof config.compress === 'boolean') {
                config.compress = {
                    width: config.width,
                    height: config.height,
                    quality: config.quality
                }
            }

            const file = this.$refs.file.files[0]
            if (file.size > config.sizeLimit) {
                this.setUploadError(this.$parent.locale['exceed size limit'])
                return
            }
            this.$refs.file.value = null

            function gennerRst() {
                const res = {file}
                const base64 = !config.upload
                return new Promise((resolve, reject) => {
                    if (base64) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                            res.base64 = e.target.result
                            resolve(res)
                        }
                        reader.onerror = (e) => {
                            reject(e)
                        }
                        reader.readAsDataURL(file)
                    } else {
                        resolve(res)
                    }
                })
            }
            const rstPromise = config.compress ? lrz(file, config.compress) : gennerRst()
            let _rst = null
            rstPromise
                .then((rst) => {
                    _rst = rst
                    // 配置beforeUpload钩子允许业务程序处理文件，或做一些上传前的准备
                    if (config.beforeUpload && typeof config.beforeUpload === 'function') {
                        return config.beforeUpload.call(null, rst.file)
                    }
                })
                .then((res) => {
                    // 如果钩子返回false，则什么都不做
                    if (typeof res === 'boolean' && res === false) {
                        return
                    }

                    // 如果钩子返回字符串，则当作是图片URL
                    if (typeof res === 'string') {
                        return this.insertImageUrl(null, res)
                    }

                    if (config.upload) {
                        this.uploadToServer(_rst.file)
                    } else {
                        this.insertBase64(_rst.base64)
                    }
                })
                .catch(this.setUploadError)
        },
        insertBase64(data) {
            this.insertImageUrl(null, data)
        },
        uploadToServer(file) {
            const config = this.$options.module.config

            const formData = new FormData()
            formData.append(config.upload.fieldName || 'image', file)

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
                        this.insertImageUrl(null, url)
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
