<template>
    <form @submit.prevent="createLink">
        <input type="text" placeholder="输入链接地址" v-model="url" maxlength="1024">
        <button type="submit">生成链接</button>
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