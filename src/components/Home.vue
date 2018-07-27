<template>
  <section class="hero is-info  is-fullheight">
    <div class="section container">
        <div class="section ">
            <h1 class="title">
                T'es bien connecté
            </h1>
            <h2 class="subtitle">
                Ton utilisateur:
            </h2>
            <div> 
                {{ this.$parent.current_user }}
            </div>
        </div>

        <div class="section">
            <h2 class="subtitle">
                Ton token pour l'api:
            </h2>
            <div> 
                {{ this.$cookies.get('api_token') }}
            </div>
        </div>

        <div class="section">
            <router-link  to="/tickets">
                <a class="button is-success">Tickets</a>
            </router-link>
            <a class="button is-danger" @click="logout">Logout</a>

        </div>
        
    </div>
    

</section>
</template>

<script>
import AuthService from '@/services/AuthService'

export default {
  name: 'home',
  data () {
    return {
    }
  },
  methods: {
    logout: function () {
      AuthService.logout(this.$cookies.get('api_token'))
      this.$cookies.remove('api_token')
      this.$router.push('/')
    }
  }
}
</script>
<style lang="scss">
@import '../styles/landing.scss'
</style>
