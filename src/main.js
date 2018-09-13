if (window.location.protocol !== 'https:') window.location.href = 'https://modimo.herokuapp.com'

import Vue from 'vue'
import App from './App'
import router from './router'
import VueCookie from 'vue-cookies'
import VueAnalytics from 'vue-analytics'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons'

library.add(faEnvelope)
library.add(faFacebookSquare)

// Analytics
Vue.use(VueAnalytics, {
    id: 'UA-116703749-3',
    router
})

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueCookie)
Vue.config.productionTip = false

import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'

Vue.use(VueChartkick, {adapter: Chart})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})
