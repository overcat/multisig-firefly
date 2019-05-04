import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// import Vconsole from 'vconsole'
//
// new Vconsole();

new Vue({
    render: h => h(App),
    router,
}).$mount('#app')
