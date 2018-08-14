<template>
      <section class="hero is-fullheight is-medium is-info is-bold">
        <div class="hero-body">
          <div class="container">
            <div class="columns is-centered">
              <article class="card is-rounded">
                <div class="card-content">
                  <h1 class="title has-text-centered">
                    <img src="/static/img/icons/logo.png" alt="Modimo" width="75">
                    <p class="has-text-dark">Welcome</p>
                  </h1>
                  <p class="control has-icon">
                    <i class="fa fa-envelope"></i>  
                    <input class="input" type="email"  v-model="email" placeholder="Email">
                  </p>
                  <p class="control has-icon">
                    <i class="fa fa-lock"></i>
                    <input class="input" type="password" v-model="password" placeholder="Password">
                  </p>
                  <p class="control has-text-centered">-</p>
                  <p class="control">
                    <button class="button is-primary is-medium is-fullwidth"  @click="login">
                      <i class="fa fa-user"></i>
                      Login
                    </button>
                  </p>
                </div>
              </article>
            </div>
          </div>
    </div>
  </section>
</template>

<script>
import AuthService from '@/services/AuthService'

export default {

    name: 'Login',
    data () {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        async login () {
            const auth = await AuthService.authenticate(this.email, this.password)
            if (auth.data.success) {
                this.$cookies.set('api_token', auth.data.token)
                this.$router.push('home')
            } else {
                alert('Couldnt log in: ' + auth.data.message)
            }
        }
    }
}
</script>

<style lang="scss">
</style>
