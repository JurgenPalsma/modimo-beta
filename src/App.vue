<template>
  <div id="app">
    <!-- GTM -->
    <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MNC6RPZ"
            height="0" width="0" style="display:none;visibility:hidden">
        </iframe>
    </noscript>

    <Nav> </Nav>
    <div class="notification-container">
        <notifications :new_notification="notification"/>
    </div>
    <router-view>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
.notification-container {
    position: fixed;
    top: 0;
    width: 100vw;
    text-align: center;
    z-index: 1000000000;
}
</style>

<script>
import UserService from '@/services/UserService'
import Nav from '@/components/navbar/Nav'
import Notifications from './components/Notifications'

// GTM snippet
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MNC6RPZ')

export default {

    name: 'app',
    created: function () {
        window.dataLayer = window.dataLayer || []
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date())
        gtag('config', 'UA-116703749-1')
    },

    mounted () {
        if (this.$cookies.get('api_token')) {
        } else if (this.$route.name !== 'Login') {
            this.$router.push('/')
        }
    },
    
    data() {
        return {
            notification: undefined
        }
    },

    methods: {
        async getCurrentUser () {
            let curUser = await UserService.getCurrentUser(this.$cookies.get('api_token'))
            if (curUser.data.success) {
                return curUser.data.user
            } else {
                console.log('Could not load current user')
                return {}
            }
        }
    },
    components: {
        Nav,
        'notifications': Notifications
    }
}
</script>

<style lang="scss">
</style>
