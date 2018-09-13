<template>
  <section class="hero modimo-dark is-fullheight-minus-navbar">
    <div class="container">
        <br/><br/>
            <h1 class="title white-title is-1">
                Applications
            </h1>
            
            <div class="columns">
                <router-link to="/tickets" class="column is-one-quarter-desktop">
                    <div class="card">
                        <div class="card-content">
                            <div class="media is-vertical-center">
                            <div class="media-left">
                                <figure class="image is-64x64">
                                <img src="/static/img/tickets.png" alt="Tickets">
                                </figure>
                            </div>
                            <div class="media-content">
                                <p class="is-size-5 has-text-weight-bold has-text-link">Tickets</p>
                                <p class="is-size-7 is-italic has-text-grey-dark">Signalez un problème à votre résidence</p>
                            </div>
                            </div>
                        </div>
                    </div>
                </router-link>
                <router-link to="/analytics" class="column is-one-quarter-desktop">
                    <div class="card">
                        <div class="card-content">
                            <div class="media is-vertical-center">
                            <div class="media-left">
                                <figure class="image is-64x64">
                                <img src="/static/img/analytics.png" alt="Analytics">
                                </figure>
                            </div>
                            <div class="media-content">
                                <p class="is-size-5 has-text-weight-bold has-text-link">Statistiques</p>
                                <p class="is-size-7 is-italic has-text-grey-dark">Observez l'activité de la résidence</p>
                            </div>
                            </div>
                        </div>
                    </div>
                </router-link>
                <div class="column is-one-quarter-desktop">
                    <div class="card">
                        <div class="card-content">
                            <div class="media is-vertical-center">
                            <div class="media-left">
                                <figure class="image is-64x64">
                                <img src="/static/img/comingsoon.png" alt="Analytics">
                                </figure>
                            </div>
                            <div class="media-content">
                                <p class="is-size-5 has-text-weight-bold has-text-dark">Prochainement</p>
                                <p class="is-size-7 is-italic has-text-grey-dark">Pleins d'applications à venir !</p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
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
@import '../styles/landing.scss';
@import '../styles/global.scss';
</style>
