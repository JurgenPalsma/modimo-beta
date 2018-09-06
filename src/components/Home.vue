<template>
  <section class="hero is-info is-fullheight-minus-navbar">
    <div class="container">
        <br/><br/>
            <h1 class="title is-1">
                Applications
            </h1>

        <!-- <div class="section">
            <h2 class="subtitle">
                Ton token pour l'api:
            </h2>
            <div> 
                {{ this.$cookies.get('api_token') }}
            </div>
        </div> -->

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
                                <p class="is-size-5 has-text-weight-bold has-text-link">Analytics</p>
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
                                <p class="is-size-5 has-text-weight-bold has-text-dark">Coming Soon</p>
                                <p class="is-size-7 is-italic has-text-grey-dark">Pleins d'applications à venir !</p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <!-- <router-link to="/tickets" class="column">
                    <div class="card">
                        <div class="card-image">
                            <figure class="image is-128x128">
                                <img src="/static/img/tickets.png" alt="Tickets" class="is-rounded"/>
                            </figure>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="media">
                            <div class="media-left">
                                <figure class="image is-48x48">
                                    <img src="/static/img/tickets.png" alt="Tickets" class="is-rounded"/>
                                </figure>
                            </div>
                            <div class="media-content">
                                <p class="title is-4">Tickets</p>
                                <p class="subtitle is-3">Lorem ipsum</p>
                            </div>
                        </div>
                    </div>
                    <figure class="image is-128x128">
                        <img src="/static/img/tickets.png" alt="Tickets" class="is-rounded"/>
                    </figure>
                    <span>Tickets</span>
                </router-link> -->
                <!-- <router-link to="/analytics" class="column">
                    <figure class="image is-128x128">
                        <img src="/static/img/analytics.png" alt="Tickets" class="is-rounded"/>
                    </figure>
                    <span>Analytics</span>
                </router-link> -->
            <!-- </div> -->
        
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
