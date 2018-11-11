import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Tickets from '@/components/tickets/Tickets'
import Modistore from '@/components/modistore/Modistore'
import StoreAppDetails from '@/components/modistore/AppDetails'
import PanneauAdmin from '@/components/panneauAdmin/PanneauAdmin'
//  import MailCreate from '@/components/Mails/mailCreate.vue'
import Analytics from '@/components/analytics/Analytics'

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
        ,
        {
            path: '/modistore/app',
            name: 'StoreAppDetails',
            component: StoreAppDetails,
            props: true
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
            path: '/panneauAdmin',
            name: 'PanneauAdministration',
            component: PanneauAdmin
        }
    ]
})
