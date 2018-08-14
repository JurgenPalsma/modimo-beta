<template>
  <div id="app">
    <Nav> </Nav>
    <router-view></router-view>
  </div>
</template>

<script>
import UserService from '@/services/UserService'
import Nav from '@/components/navbar/Nav'

export default {

    name: 'app',
    mounted () {
        if (this.$cookies.get('api_token')) {
        } else if (this.$route.name !== 'Login') {
            this.$router.push('/')
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
        Nav
    }
}
</script>

<style lang="scss">
</style>
