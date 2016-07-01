<template>

    <div :style="{'height':$parent.contentHeight+'px'}">
        <form @submit="insertImage" v-if="upload.status=='ready'">
            <input type="text" v-model="url" maxlength="255" placeholder="输入图片文件地址">
            <button type="submit">插入网络图片</button>
            <button type="button" @click="pick">本地上传</button>
            <input type="file" v-el:file style="display: none !important;" @change="selectFile"
                   accept="image/png,image/jpeg,image/gif,image/jpg">
        </form>
        <div v-if="upload.status=='progress'">
            正在进行上传,进度:{{progressComputable ? "未知" : upload.complete}}
        </div>
        <div v-if="upload.status=='success'">
            文件上传完成,请稍等...
        </div>
        <div v-if="upload.status=='error'">
            上传发生错误,
            <button type="button" @click="reset">点击重新上传</button>
        </div>
        <div v-if="upload.status=='abort'">
            上传被中断,
            <button type="button" @click="reset">点击重新上传</button>
        </div>
    </div>

</template>

<script>

    import lrz from '../../node_modules/lrz/dist/lrz.all.bundle'
    export default {
        props: {
            config: {
                required: true,
                type: Object
            }
        },
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
                let file = this.$els.file.files[0]
                if (file.size > component.config.size_limit) {
                    alert("文件过大")
                    return
                }
                component.$els.file.value = null
                //需要压缩
                if (component.config.compress) {
                    lrz(file, {
                        width: component.config.width,
                        height: component.config.height,
                        quality: component.config.quality,
                        fieldName: component.config.fieldName
                    }).then(function (rst) {
                        component.config.server ? component.uploadFile(rst.file) : component.insertBase64(rst.base64)
                    }).catch(function (err) {
                        component.upload.status = "error"
                        console.log("upload error", err)
                    })
                    return
                }
                //不需要压缩
                //base64
                if (!component.config.server) {
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
                var formData = new FormData();
                formData.append(component.config.fieldName, file)
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
                    var json = JSON.parse(xhr.responseText)
                    if (!json.ok) {
                        alert(json.msg)
                    } else {
                        component.$parent.execCommand("insertImage", json.data)
                    }
                    component.upload.status = "ready"
                }
                xhr.onerror = function (e) {
                    component.upload.status = "error"
                    console.log("upload error", e)
                }
                xhr.onabort = function (e) {
                    component.upload.status = "abort"
                    console.log("upload abort", e)
                }
                xhr.open("POST", component.config.server)
                xhr.send(formData)
            }
        }
    }

</script>
