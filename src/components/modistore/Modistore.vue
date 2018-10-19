<template>
  <section class="hero modimo-dark is-fullheight-minus-navbar">
    <div class="container">
        <br/><br/>
            <h1 class="title white-title is-1">
                Modistore
            </h1>
            <div class="columns is-multiline is-mobile">
                <div v-for="app in applications" :key="app._id" class="column is-one-quarter-desktop"> 
                    <div>
                        <div class="card" style="border-radius: 3px">
                            <div class="card-content">
                                <div class="media is-vertical-center">
                                    <div class="media-left">
                                        <figure class="image is-64x64">
                                        <img :src="app.mini_logo" :alt="app.name">
                                        </figure>
                                    </div>
                                    <div class="media-content ">
                                        <p class="is-size-5 has-text-weight-bold has-text-link is-horizontal-center">{{app.shortname}}</p>
                                        
                                    </div>
                                    
                                </div>
                                <div class="content">
                                        <p class="is-size-7 is-italic has-text-grey-dark">{{app.description}}</p>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column is-one-quarter-desktop">
                        <div class="card" style="border-radius: 3px">
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
import ModistoreService from '@/services/ModistoreService'
import moment from 'moment'

export default {
    name: 'home',
    data () {
        return {
            current_user: null,
            applications: []
        }
    },

    mounted: function () {
        this.load()
    },

    methods: {

        async getApps () {
            const resp = await ModistoreService.getAllApplications(this.$cookies.get('api_token'));
            if (resp.data.sucess) {
                this.applications = resp.data.applications
                this.applications.splice(this.applications.findIndex(a => a.shortname === "ModiStore"), 1);
            } else {
                this.$parent.notification = {type: 'failure', message: 'Erreur lors de la récupération des applications'}
            }
        },

        async load () {
            this.current_user = await this.$parent.getCurrentUser()
            await this.getApps()
            console.log(this.applications)
        },

        logout: function () {
            AuthService.logout(this.$cookies.get('api_token'))
            this.$cookies.remove('api_token')
            this.$router.push('/')
        }
    },
}

</script>

<style lang="scss">
@import './scss/ModiStore.scss';
@import '../../styles/global.scss';
</style>