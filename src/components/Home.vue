<template>
    <section class="hero modimo-dark is-fullheight-minus-navbar">
        <div class="hero-body">
            <div class="container">
                <br/><br/>
                <h1 class="title white-title is-1">
                    Applications
                </h1>
                
                <div class="columns is-multiline is-mobile">
                    <router-link v-for="app in applications" :key="app._id" :to="app.link" class="column is-12-mobile is-6-tablet is-3-desktop">
                        <div class="card" style="border-radius: 3px">
                            <div class="card-content">
                                <div class="media is-vertical-center">
                                    <div class="media-left">
                                        <figure class="image is-64x64">
                                            <img :src="app.mini_logo" :alt="app.shortname">
                                        </figure>
                                    </div>
                                    <div class="media-content">
                                        <p class="is-size-5 has-text-weight-bold has-text-link">{{app.shortname}}</p>
                                        <p class="is-size-7 is-italic has-text-grey-dark modimo-app-description">{{app.small_description}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import AuthService from '@/services/AuthService'
import ModistoreService from '@/services/ModistoreService'

export default {
    name: 'home',
    data () {
        return {
            current_user: null,
            applications: []
        }
    },

    created: async function () {
        this.load()
    },

    methods: {
        load () {
            // this.current_user = this.$parent.getCurrentUser()
            this.current_user = this.$parent.currentUser
            ModistoreService.getMyInstalledApplications(this.$cookies.get('api_token'))
            .then(response => {
                this.applications = response.data.applications;
            })
        },
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
