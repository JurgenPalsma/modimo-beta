<template>
  <section class="hero is-info is-fullheight">

    <!-- If the Api is online, display landing page -->
    <div v-if="!loading" >
        <div class="hero-head">
            <nav class="navbar"> 
                    <div id="navbarMenu" class="navbar-menu">
                        <div class="navbar-end" >
                            <span class="navbar-item">
                                <a class="button is-white is-outlined" href="/login">
                                    <span class="icon">
                                        <i class="fa fa-key"></i>
                                    </span>
                                    <span>Connection</span>
                                </a>
                            </span>
                        </div>
                    </div>
            </nav>
            </div>            
            
            <div v-if="form_state === 'not engaged'" class="section is-medium hero-body">
                <div class="container has-text-centered">
                    <div class="column is-6 is-offset-3">
                        <h1 class="title section">
                            La Résidence 2.0
                        </h1>
                        <h2 class="subtitle disruptBtn">
                           Etes vous prêt(e) à disrupter votre résidence? Un paragraphe #startupnation qui explique le produit
                        </h2>
                        
                    </div>
                    <section>
                        <iframe src="https://www.youtube.com/embed/N9X0G11SmWA" frameborder="0" width="1280" height="420" allow="autoplay; encrypted-media" allowfullscreen class="video-aligned"></iframe>
                    </section>
                    <div class="column is-6 is-offset-3">
                        <a class="button is-large is-fullwidth is-rounded has-text-white glowing" v-on:click="engage('interested')">Je Disrupte</a>
                    </div>
                </div>
            </div>
            <div v-else-if="form_state === 'interested'" class="section is-large hero-body">
                <div class="container has-text-centered">
                    <div class="columns">
                        <div class="column">
                            <div class="blog-card spring-fever" v-on:click="engage('email', true)">
                                <div class="title-content">
                                    <h3>Je suis un professionnel.</h3>
                                </div>
                                <div class="card-info">
                                    Si vous êtes un professionnel, venez découvrir les avantages que Modimo peut vous apporter dans votre travail.
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="blog-card spring-fever" v-on:click="engage('email')">
                                <div class="title-content">
                                    <h3>Je suis un particulier.</h3>
                                </div>
                                <div class="card-info">
                                    Si vous êtes un particulier, venez essayer la plateforme Modimo que votre co-propriété est suscéptible d'utiliser dans votre résidence.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="form_state === 'email' && !email_error" class="section is-large hero-body">
                <div class="container ">
                  <div class="column is-6 is-offset-3">
                      <h1 class="title">
                          Pas si vite!
                      </h1>
                      <h2 class="subtitle">
                          Entre ton adresse email pour créer ton compte et découvrir la plateforme.
                      </h2>
                      
                      <div class="box">
                            <div class="field is-grouped">
                                <p class="control is-expanded">
                                    <input class="input" type="text" v-model="email" placeholder="Email">
                                </p>
                                <p class="control">
                                    <a class="button is-info" @click="launch_demo">
                                       J'y vais
                                    </a>
                                </p>
                            </div>
                        </div>                  
                    </div>
                </div>
            </div>

            <div v-else-if="form_state === 'email' && email_error" class="section is-large hero-body">
                <div class="container ">
                  <div class="column is-6 is-offset-3">
                      <h1 class="title">
                          Ooooops
                      </h1>
                      <h2 class="subtitle">
                          Ton email est invalide. Renseigne une vraie adresse email.
                      </h2>
                      
                      <div class="box">
                            <div class="field is-grouped">
                                <p class="control is-expanded">
                                    <input class="input is-danger" type="text" v-model="email" placeholder="Entre un vrai mail ici">
                                </p>
                                <p class="control">
                                    <a class="button is-info" @click="launch_demo">
                                       J'y vais
                                    </a>
                                </p>
                            </div>
                        </div>                  
                    </div>
                </div>
            </div>
            <footer class="footer hero is-info">
                <div class="columns is-mobile">
                <div class="column is-vertical-center">
                    <a @click="contactModal()" style="color: #4a4a4a">
                    <p><strong>Contact</strong></p>
                    </a>
                </div>
                <div class="column"></div>
                <div class="column"></div>
                <div class="column" is-vertical-center>
                    <p><strong>Réseaux sociaux:</strong></p>
                    <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'facebook-square' }"/>
                    <a href="https://www.facebook.com/ModimoFR/">Notre Facebook</a>
                </div>
            </div>
            </footer>
      </div>

      <!-- If the Api is offline, display loader -->
      <div v-else> 
        <h2 class="section title has-text-centered">
            Chargement...
        </h2>
        <div class="section is-flex is-horizontal-center is-medium">
          <figure class="image is-loader  is-128x128 ">
            <img src="../assets/logo.png">
          </figure>
          </div>
      </div>
      <contact v-show="showModalContact" @close_modal="showModalContact = false"></contact>
    </section>
</template>

<script>
import DemoService from '@/services/DemoService'
import AuthService from '@/services/AuthService'
import Contact from './Contact.vue'

export default {
    name: 'landing',
    videoId: 'S7A77ClZKcQ',
    data () {
        return {
            showModalContact: false,
            form_state: 'not engaged',
            role: 'resi',
            email: '',
            email_error: false,
            api_online: false,
            loading: false
        }
    },

    components: {
        'contact': Contact
    },

    mounted () {
    },

    methods: {
        ready (event) {
            this.player = event.player
        },
        playing (event) {
            // The player is playing a video.
        },
        change () {
            // when you change the value, the player will also change.
            // If you would like to change `playerVars`, please change it before you change `videoId`.
            // If `playerVars.autoplay` is 1, `loadVideoById` will be called.
            // If `playerVars.autoplay` is 0, `cueVideoById` will be called.
            this.videoId = 'another video id'
        },
        stop () {
            this.player.stopVideo()
        },
        pause () {
            this.player.pauseVideo()
        },

        engage: function (state, admin = false) {
            this.form_state = state
            if (state === 'email') {
                // Launch heroku dyno if api is offline by pinging it
                this.ping_api()
            }
            if (admin) this.role = 'admin'
        },
        async ping_api () {
            const response = await AuthService.ping()
            if (response.data.success) {
                this.api_online = true
            }
        },
        async launch_demo () {
            this.loading = true
            const demo = this.role === 'resi' ? await DemoService.create_resident_demo(this.email) : await DemoService.create_admin_demo(this.email)
            if (demo.data.success) {
                console.log(demo.data)
                const auth = await AuthService.authenticate(demo.data.user.email, demo.data.user.password)
                if (auth.data.success) {
                    this.$cookies.set('api_token', auth.data.token)
                    this.$parent.current_user = demo.data.user
                    this.$parent.api_token = auth.data.token
                    this.$router.push('home')
                } else {
                    alert('Couldnt log in: ' + auth.data.message)
                    this.loading = false
                }
            } else {
                this.email_error = true
                this.loading = false
            }
        },

        contactModal: function () {
            this.showModalContact = true
        }
    }
}
</script>

<style lang="scss">
@import '../styles/landing.scss'
</style>
