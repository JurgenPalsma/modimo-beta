import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Tickets from '@/components/tickets/Tickets'
import Modistore from '@/components/modistore/Modistore'
//  import MailCreate from '@/components/Mails/mailCreate.vue'
import Analytics from '@/components/analytics/Analytics'
import StoreAppDetails from '@/components/store/AppDetails'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Landing',
            component: Landing
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/home',
            name: 'Home',
            component: Home
        },
        {
            path: '/modistore',
            name: 'Modistore',
            component: Modistore
        },
        {
            path: '/tickets',
            name: 'Tickets',
            component: Tickets
        },
        {
            path: '/analytics',
            name: 'Analytics',
            component: Analytics
        },
        {
            path: '/store/app',
            name: 'StoreAppDetails',
            component: StoreAppDetails
        }
    ]
})
