let _Vue = null 
class VueRouter {
  static install(Vue) {
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true

    // 在全局记录Vue的构造函数
    _Vue = Vue
    // 把router对象注入到Vue实例
    _Vue.mixin({
        beforeCreate() {
          // 这里只需要注入一次即可
          if (this.$options.router) {
            _Vue.prototype.$router = this.$options.router
          }
        }
    })
  }
  constructor(options) {
    this.options = options // 接收路由信息
    this.routeMap = {}
    this.data = _Vue.observable({
      current: '#'
    })
    this.init()
  }

  init() {
    this.createRouteMap()
    this.initComponent(_Vue)
    this.initEvent()
  }
  // 把路由规则解析成键值对存储到routeMap中
  createRouteMap() {
    this.options.route.forEach(element => {
      this.routeMap[element.path] = element.component
    })
  }
  // 初始化组件
  initComponent() {
    Vue.component('router-link', {
      props: {
        to: String
      },
      render(h) {
        return h('a', {
          attrs:{
            href:this.to
          },
          on:{
              click:this.clickhander
          }
        })
      }
    })
    const self = this
      Vue.component("router-view",{
          render(h){
              const cm=self.routeMap[self.data.current]
              return h(cm)
          }
      })
  }
  initEvent() {
    window.addEventListener("hashchange",()=>{
      this.data.current = window.location.pathname
  })
  }
}