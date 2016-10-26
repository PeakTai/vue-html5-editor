<template>

    <div>
        <form @submit="insertImage" v-if="upload.status=='ready'">
            <input type="text" v-model="url" maxlength="255" :placeholder="$parent.locale['please enter a url']">
            <button type="submit">{{$parent.locale.save}}</button>
            <button type="button" @click="pick">{{$parent.locale.upload}}</button>
            <input type="file" v-el:file style="display: none !important;" @change="selectFile"
                   accept="image/png,image/jpeg,image/gif,image/jpg">
        </form>
        <div v-if="upload.status=='progress'">
            {{$parent.locale.progress}}:{{progressComputable ? $parent.locale.unknown : upload.complete}}
        </div>
        <div v-if="upload.status=='success'">
            {{$parent.locale.["please wait"]}}...
        </div>
        <div v-if="upload.status=='error'">
            {{$parent.locale.upload}}&nbsp;{{$parent.locale.error}},
            <button type="button" @click="reset">{{$parent.locale.reset}}</button>
        </div>
        <div v-if="upload.status=='abort'">
            {{$parent.locale.upload}}&nbsp;{{$parent.locale.abort}},
            <button type="button" @click="reset">{{$parent.locale.reset}}</button>
        </div>
    </div>

</template>

<script>

    import lrz from 'lrz'
    export default {
        data() {
            return {
                url: "",
                upload: {
                    status: "ready", //progress,success,error,abort
                    progressComputable: false,
                    complete: 0
                }

            }
        },
        methods: {
            reset(){
                this.upload.status = "ready"
            },
            pick() {
                this.$els.file.click()
            },
            insertImage(e) {
                e.preventDefault()
                if (!this.url) {
                    return
                }
                this.$parent.execCommand("insertImage", this.url)
                this.url = null
            },
            selectFile(e) {
                let component = this
                let config = component.$options.module.config

                let file = this.$els.file.files[0]
                if (file.size > config.size_limit) {
                    let prompt = component.$parent.locale["exceed size limit"]
                    alert(prompt)
                    return
                }
                component.$els.file.value = null
                //需要压缩
                if (config.compress) {
                    lrz(file, {
                        width: config.width,
                        height: config.height,
                        quality: config.quality,
                        fieldName: config.fieldName
                    }).then(function (rst) {
                        config.server ? component.uploadFile(rst.file) : component.insertBase64(rst.base64)
                    }).catch(function (err) {
                        component.upload.status = "error"
                        console.log("upload error", err)
                    })
                    return
                }
                //不需要压缩
                //base64
                if (!config.server) {
                    var reader = new FileReader()
                    reader.onload = function (e) {
                        component.insertBase64(e.target.result)
                    }
                    reader.readAsDataURL(file)
                    return
                }
                //上传服务器
                component.uploadFile(file)
            },
            insertBase64: function (data) {
                this.$parent.execCommand("insertimage", data)
            },
            uploadFile(file) {
                var component = this
                let config = component.$options.module.config
                var formData = new FormData();
                formData.append(config.fieldName, file)
                var xhr = new XMLHttpRequest()
                xhr.onprogress = function (e) {
                    component.upload.status = "progress"
                    if (e.lengthComputable) {
                        component.upload.progressComputable = true
                        var percentComplete = e.loaded / e.total;
                        component.upload.complete = (percentComplete * 100).toFixed(2)
                    } else {
                        component.upload.progressComputable = false
                    }
                }
                xhr.onload = function (e) {
                    if (xhr.status != 200) {
                        component.upload.status = "error"
                        console.log("upload error", e)
                        return
                    }
                    component.upload.status = "success"
                    try {
                        let url = config.uploadHandler(xhr.responseText)
                        if (url) {
                            component.$parent.execCommand("insertImage", url)
                        }
                    } catch (e) {
                        console.error(e)
                    } finally {
                        component.upload.status = "ready"
                    }


                }
                xhr.onerror = function (e) {
                    component.upload.status = "error"
                    console.log("upload error", e)
                }
                xhr.onabort = function (e) {
                    component.upload.status = "abort"
                    console.log("upload abort", e)
                }
                xhr.open("POST", config.server)
                xhr.send(formData)
            }
        }
    }

</script>
