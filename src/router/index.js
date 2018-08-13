import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import Home from '@/components/Home'
import Tickets from '@/components/tickets/Tickets'
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
            path: '/home',
            name: 'Home',
            component: Home
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
        }
    ]
})
