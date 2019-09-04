<template>
    <div id="app">
        <!-- <router-view /> -->
        <router-view v-if="isReloadAlive"></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',
    //页面刷新方法定义
    provide() {
        return {
            reload: this.reload
        }
    },
    data() {
        return{
            isReloadAlive: true
        }
    },
    created () {
        //在页面加载时读取sessionStorage里的状态信息
        if (sessionStorage.getItem("store") ) {
            this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
        } 

        //在页面刷新时将vuex里的信息保存到sessionStorage里
        window.addEventListener("beforeunload",()=>{
            sessionStorage.setItem("store",JSON.stringify(this.$store.state))
        })
    },
    methods: {
        reload() {
            this.isReloadAlive = false;
            this.$nextTick(function(){
                this.isReloadAlive = true;
            })
        }
    }
}
</script>


<style>
body, html {
    font-family: Hiragino Sans GB,Microsoft YaHei,SimSun,Arial,Helvetica Neue,Helvetica!important;
}
</style>

