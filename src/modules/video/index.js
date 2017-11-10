import dashboard from './dashboard'

/**
 * insert video
 * Created by liuJD on 17/11/10.
 */
export default {
    name: 'video',
    icon: 'fa fa-file-video-o',
    i18n: 'video',
    config: {
        // server: null,
        // fieldName: 'video',
        // compress: true,
        // width: 1600,
        // height: 1600,
        // quality: 80,
        sizeLimit: 512 * 1024,// 512k
        // upload: {
        //     url: null,
        //     headers: {},
        //     params: {},
        //     fieldName: {}
        // },
        uploadHandler(responseText){
            const json = JSON.parse(responseText)
            return json.ok ? json.data : null
        }
    },
    dashboard
}
