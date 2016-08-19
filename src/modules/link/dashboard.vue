<template>
    <form @submit.prevent="createLink">
        <input type="text" :placeholder="$parent.locale['please enter a url']" v-model="url" maxlength="1024">
        <button type="submit">{{$parent.locale["create link"]}}</button>
    </form>
</template>
<script>
    export default {
        data(){
            return {url: null}
        },
        methods: {
            createLink(){
                if (!this.url) {
                    return
                }
                this.$parent.execCommand("createLink", this.url)
                this.url = null
            }
        }
    }
</script>