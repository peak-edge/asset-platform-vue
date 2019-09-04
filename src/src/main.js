import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
// import Cookies from 'js-cookie'
// import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import axios from 'axios'

import '@/icons' // icon
import '@/permission' // permission control

import FormMaking from 'form-making' //  form
import 'form-making/dist/FormMaking.css'

import VueGridLayout from 'vue-grid-layout'
import echarts from 'echarts'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import Vuex from 'vuex'

import Vue2OrgTree from 'vue2-org-tree'
import treeTransfer from 'el-tree-transfer'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
    mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.use(FormMaking)
Vue.use(VueGridLayout)
Vue.use(echarts)
//Vue.use(Viewer) 默认配置写法,点击图片放大功能
Vue.use(Viewer, {
    defaultOptions: {
        zIndex: 9999
    }
})
Viewer.setDefaults({ Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' } })
Vue.use(Vuex)

Vue.use(Vue2OrgTree)
Vue.use(treeTransfer)
Vue.prototype.$ajax= axios

var GridLayout = VueGridLayout.GridLayout
var GridItem = VueGridLayout.GridItem

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    data: function() {
        return {
            apptitle: '',
            appid: '',
            Authorization: '',
        }
    },
    render: h => h(App)
}).$mount('#app');
