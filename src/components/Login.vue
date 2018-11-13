<template>
  <section class="hero is-fullheight modimo-dark">
    <div class="hero-body" style="align-items: center">
      <div class="container">
        <div class="columns is-centered">
          <article class="card" style="border-radius: 3px">
            <div class="card-content">
              <h1 class="title has-text-centered">
                <img src="/static/img/icons/logo.png" alt="Modimo" width="75">
                <p class="text-dark">Bienvenue</p>
              </h1>

                <div class="field">
                  <label class="label">Email</label>
                  <div class="control has-icons-left has-icons-right">
                    <input class="input" type="email" placeholder="Votre Mail..." v-model="email">
                    <span class="icon is-small is-left">
                      <i class="fas fa-envelope"></i>
                    </span>
                  </div>
                </div>

                <div class="field">
                  <label class="label">Mot de passe</label>
                  <div class="control has-icons-left has-icons-right">
                    <input @keypress.enter="login" class="input" type="password" placeholder="Votre Mot de passe..." v-model="password">
                    <span class="icon is-small is-left">
                      <i class="fas fa-key"></i>
                    </span>
                  </div>
                </div>
                <p class="control">
                  <button class="button is-primary is-medium is-fullwidth" @click="login">
                    Connexion
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
                this.$parent.notification = {type: 'failure', message: auth.data.message}
            }
        }
    }
}
</script>

<style lang="scss">
@import '../styles/global.scss'
</style>
