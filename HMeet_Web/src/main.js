import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import io from 'socket.io-client';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.scss'
import store from './store'
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$io = io
Vue.mixin({
  methods: {
    getAuthor() {
      return {
        Authorization: sessionStorage.token || ''
      }
    }
  },
})
new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
