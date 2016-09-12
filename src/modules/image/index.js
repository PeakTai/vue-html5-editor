import dashboard from "./dashboard.vue";

/**
 * insert image
 * Created by peak on 16/8/18.
 */
export default {
    name: "image",
    icon: "fa fa-file-image-o",
    i18n: "image",
    show: true,
    config: {
        server: null,
        fieldName: "image",
        sizeLimit: 512 * 1024,//512k
        compress: true,
        width: 1600,
        height: 1600,
        quality: 80,
        uploadHandler(responseText){
            var json = JSON.parse(responseText)
            if (!json.ok) {
                alert(json.msg)
            } else {
                return json.data
            }
        }
    },
    dashboard
}
