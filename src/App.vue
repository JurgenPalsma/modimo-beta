<template>
  <div id="app">
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

export default {

    name: 'app',
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
