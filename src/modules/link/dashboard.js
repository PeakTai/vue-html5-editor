import template from './dashboard.html'

export default {
    template,
    data(){
        return {url: null}
    },
    methods: {
        createLink(){
            if (!this.url) {
                return
            }
            this.$parent.execCommand('createLink', this.url)
            this.url = null
        }
    }
}
