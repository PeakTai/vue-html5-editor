<template>
    <form @submit="createLink">
        <input type="text" placeholder="输入链接地址" v-model="url">
        <button type="submit">生成链接</button>
    </form>
</template>
<script>
    export default {
        data(){
            return {url: ""}
        },
        methods: {
            createLink(e){
                e.preventDefault()
                if (!this.url) {
                    return
                }
                this.$parent.execCommand("createLink", this.url)
                this.url = null
            }
        }
    }
</script>