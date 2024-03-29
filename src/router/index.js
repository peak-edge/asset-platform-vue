import Vue from 'vue'
import Router from 'vue-router'
import number from '@/views/home/MyFlow'

Vue.use(Router)
Vue.use(number)

/* Layout */
import Layout from '@/layout'
/* Router Modules */
// import modelerRouter from './modules/flowable-modeler'

export const constantRoutes = [
 // {
 //    path: '/',
 //    component: () => import('@/views/login'),
 //    hidden: true
 //  },
  {
    path: '/',
    component: () => import('@/views/home/index'),
    hidden: true
  },
  {
    path: '/reg',
    component: () => import('@/views/login/register1'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/homedesigner',
    component: () =>import('@/views/home/HomeDesign'),
    hidden: true
  },
  {
    path: '/controlpanel',
    component: () =>import('@/views/controlPanel'),
    // hidden: true
    name: 'controlpanel',
    // meta: { title: '我的流程', icon: 'table' },
    children: [
      {
        path: 'workpanel',
        name: 'workpanel',
        component: () => import('@/views/controlPanel/content/workPanel/notice'),
        meta: { title: '工作台', icon: 'table'}
      },
      {
        path: 'systemmonitor/interfacedoc',
        name: 'interfacedoc',
        component: () => import('@/views/controlPanel/content/systemMonitor/interfacedoc'),
        meta: { title: '系统监控-接口文档', icon: 'table'}
      },
      {
        path: 'businessresource/app',
        name: 'app',
        component: () => import('@/views/controlPanel/content/businessResource/app'),
        meta: { title: '业务资源管理-应用管理', icon: 'table'}
      },
      {
        path: 'businessresource/form',
        name: 'form',
        component: () => import('@/views/controlPanel/content/businessResource/form'),
        meta: { title: '业务资源管理-表单管理', icon: 'table'}
      },
      {
        path: 'businessresource/flow/model',
        name: 'flow_model',
        component: () => import('@/views/controlPanel/content/businessResource/flow/flow_model'),
        meta: { title: '业务资源管理-流程管理-流程模型', icon: 'table'}
      },
      {
        path: 'businessresource/flow/instance',
        name: 'flow_instance',
        component: () => import('@/views/controlPanel/content/businessResource/flow/flow_instance'),
        meta: { title: '业务资源管理-流程管理-流程实例', icon: 'table'}
      },
      {
        path: 'businessresource/flow/monitor',
        name: 'flow_monitor',
        component: () => import('@/views/controlPanel/content/businessResource/flow/flow_monitor'),
        meta: { title: '业务资源管理-流程管理-流程监控', icon: 'table'}
      },
      {
        path: 'businessresource/flow/monitor2',
        name: 'flow_monitor2',
        component: () => import('@/views/controlPanel/content/businessResource/flow/flow_monitor2'),
        meta: { title: '业务资源管理-流程管理-流程监控2', icon: 'table'}
      },
      {
        path: 'businessresource/business_role',
        name: 'business_role',
        component: () => import('@/views/controlPanel/content/businessResource/business_role'),
        meta: { title: '业务资源管理-业务角色管理', icon: 'table'}
      },
      {
        path: 'system/user',
        name: 'user',
        component: () => import('@/views/controlPanel/content/systemManagement/user'),
        meta: { title: '系统管理-用户管理', icon: 'table'}
      },
      {
        path: 'system/organization',
        name: 'organization',
        component: () => import('@/views/controlPanel/content/systemManagement/organization'),
        meta: { title: '系统管理-组织机构', icon: 'table'}
      },
      {
        path: 'system/scene',
        name: 'scene',
        component: () => import('@/views/controlPanel/content/systemManagement/scene'),
        meta: { title: '系统管理-场景管理', icon: 'table'}
      },
      {
        path: 'system/platform_role',
        name: 'platform_role',
        component: () => import('@/views/controlPanel/content/systemManagement/platform_role'),
        meta: { title: '系统管理-平台角色管理', icon: 'table'}
      },
      {
        path: 'system/dictionary',
        name: 'dictionary',
        component: () => import('@/views/controlPanel/content/systemManagement/dictionary'),
        meta: { title: '系统管理-字典管理', icon: 'table'}
      },
      {
        path: 'system/menu',
        name: 'menu',
        component: () => import('@/views/controlPanel/content/systemManagement/menu'),
        meta: { title: '系统管理-菜单管理', icon: 'table'}
      }
    ]
  },
  {
    path: '/appinfomation',
    component: () =>import('@/views/home/AppInfomation'),
    hidden: true
  },
  {
    path: '/myflow',
    component: () =>import('@/views/home/MyFlow'),
    // redirect: '/myflow/waitdone',
    name: 'myflow',
    meta: { title: '我的流程', icon: 'table' },
    children: [
      {
        path: 'waitdone',
        name: 'waitdone',
        component: () => import('@/views/home/MyFlowMethods/waitDone'),
        meta: { title: '待办', icon: 'table'}
      },
      {
        path: 'waitread',
        name: 'waitread',
        component: () => import('@/views/home/MyFlowMethods/waitRead'),
        meta: { title: '待阅', icon: 'table'}
      },
      {
        path: 'startedme',
        name: 'startedme',
        component: () => import('@/views/home/MyFlowMethods/startedMe'),
        meta: { title: '我发起的', icon: 'table'}
      },
      {
        path: 'wholeflow',
        name: 'wholeflow',
        component: () => import('@/views/home/MyFlowMethods/wholeFlow'),
        meta: { title: '全部', icon: 'table'}
      }
    ]
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: 'Dashboard', icon: 'dashboard' }
  //   }]
  // },

  {
    path: '/home',
    // redirect: '/home',
    component: () => import('@/views/home/index')
  },
  {
    path: '/adminhome',
    // redirect: '/home',
    component: () => import('@/views/adminhome/index'),
  },
  {
    path: '/historyflow',
    // redirect: '/home',
    component: () => import('@/views/adminhome/historyFlow'),
    hidden: true
  },
  {
    path: '/form',
    component: () => import('@/views/form/index'),
    redirect: '/form/formdesign',
    name: 'form',
    meta: { title: '表单设计', icon: 'table' },
    children: [
      {
        path: 'formdesign',
        name: 'formdesign',
        component: () => import('@/views/form/menu/formDesign'),
        meta: { title: 'formdesign', icon: 'table', keepAlive:true}
      },
      {
        path: 'flowdesign',
        name: 'flowdesign',
        component: () => import('@/views/form/menu/flowDesign'),
        meta: { title: 'flowdesign', icon: 'table', keepAlive:true}
      },
      {
        path: 'listdesign',
        name: 'listdesign',
        component: () => import('@/views/form/menu/listDesign'),
        meta: { title: 'listdesign', icon: 'table', keepAlive:true}
      },
      {
        path: 'formsetting',
        name: 'formsetting',
        component: () => import('@/views/form/menu/formSetting'),
        meta: { title: 'formsetting', icon: 'table', keepAlive:true}
      }
    ]
  },
  {
    path: '/wform',
    component: () => import('@/views/wform/index')
  },
  {
    path: '/app',
    component: Layout,
    redirect: '/app/application',
    name: 'app',
    meta: { title: '应用管理', icon: 'application' },
    children: [
      {
        path: 'application',
        name: 'application',
        component: () => import('@/views/app/index'),
        meta: { title: '应用管理', icon: 'table' }
      },
      {
        path: 'authority',
        name: 'authority',
        component: () => import('@/views/authority/index'),
        meta: { title: '权限管理', icon: 'table' }
      },
      {
        path: 'addressInfo',
        name: 'addressInfo',
        component: () => import('@/views/addressInfo/index'),
        meta: { title: '场景管理', icon: 'table' }
      },
      {
        path: 'organization',
        name: 'organization',
        component: () => import('@/views/organization/index'),
        meta: { title: '组织机构', icon: 'table' }
      },
      {
        path: 'peopleInfo',
        name: 'peopleInfo',
        component: () => import('@/views/peopleInfo/index'),
        meta: { title: '人员管理', icon: 'table' }
      }
    ]
  },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
