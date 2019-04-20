import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './components/Home'
import EnableMultiSignature from './components/EnableMultiSignature'

Vue.use(VueRouter)

const routes = [
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/enable-multi-signature',
        name: 'enable-multi-signature',
        component: EnableMultiSignature
    },
]

const router = new VueRouter({routes})

export default router