import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './components/Home'
import EnableMultiSignature from './components/EnableMultiSignature'
import Payment from './components/Payment'
import Detail from './components/Detail'

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
    {
        path: '/payment',
        name: 'payment',
        component: Payment
    },
    {
        path: '/detail/:txId',
        name: 'detail',
        component: Detail
    },
]

const router = new VueRouter({routes})

export default router