<template>
    <div>
        <section class="is-fullheight">
        <!-- If the Api is online, display landing page -->
        <div v-if="!loading">
            <div class="modimo-clear modimo-navbar">
                <nav class="navbar modimo-dark">
                    <div class="navbar-end" style="justify-content:flex-end;margin-left:auto;align-items: stretch;display: flex;">
                        <span class="navbar-item">
                            <a class="button is-outlined" href="/login">
                                <span class="icon">
                                    <i class="fa fa-key"></i>
                                </span>
                                <span>Connexion</span>
                            </a>
                        </span>
                    </div>
                </nav>
            </div>

            <div v-if="form_state === 'not engaged'" class="is-fullheight section modimo-clear modimo-landingtitle-container has-text-centered">
                <div class="modimo-background">
                    <img src="/static/img/modimophone.png" class="modimo-background-img"/>
                </div>
                <div class="container" style="padding-right: 0; width: 100%; max-width: 100%">
                    <br/>
                    <div class="columns has-text-left">
                        <div class="column is-6 is-vertical-center">
                            <h1 class="landing-title">Un room service dans votre propre appartement</h1>
                            <br/>
                            <p class="landing-subtitle is-5 has-text-left">
                                Nous travaillons dur pour vous proposer un outil de gestion de votre residence qui ameliorera votre confort et les relations entre vous, vos voisins, et vos gérants de résidence. 
                                Cliquez sur "Decouvrir Modimo" pour essayer notre beta <b>gratuitement</b>!
                            </p>
                            <div style="align-self: center">
                                <a class="button is-large discover-button" v-on:click="scrollToTop();engage('interested')">Découvrir Modimo</a>
                            </div>
                        </div>
                        <div class="column is-6 is-centered">
                            <!-- <div class="modimo-img-container">
                                <img src="/static/img/logofull.png">
                            </div> -->
                        </div>
                    </div>
                </div>
                <span class="modimo-lamndind-down"><i class="fa fa-chevron-down fa-2x"/></span>
            </div>
            <div v-else-if="form_state === 'interested'" class="section modimo-clear modimo-landingtitle-container is-fullheight">
                <div class="container has-text-centered pro-part-container">
                    <br/><br/>
                    <div class="columns">
                        <div class="column is-full-mobile">
                            <div class="blog-card spring-fever" v-on:click="engage('email', true)">
                                <div class="title-content">
                                    <h3>Je suis gerant de résidence </h3>
                                </div>
                                <div class="card-info">
                                    Proprietaire ou gerant de residence, hotels, ou logements pros,
                                    vous aurez accès à un outil de gestion de votre bien, qui centralisera les communications avec vos clients et vous donnera une vue d'ensemble sur vos residents, travaux et tâches.
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="blog-card spring-fever" v-on:click="engage('email')">
                                <div class="title-content">
                                    <h3>Je suis un résident</h3>
                                </div>
                                <div class="card-info">
                                    J'habite ou loge dans une résidence, un hotel, une colloc,...
                                    en tant que résident, vous pouvez via notre appli rapporter des problemes au sein de votre résidence ou discuter avec vos voisins!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <span @click="scrollToTop();engage('not engaged')" class="landing-back-button">Retour</span>
                <span class="modimo-lamndind-down"><i class="fa fa-chevron-down fa-2x"/></span>
            </div>

            <div v-else-if="form_state === 'email' && !email_error" class="section modimo-clear modimo-landingtitle-container is-fullheight form-registration">
                <div class="container">
                    <br/><br/>
                    <div class="column">
                        <h1 class="title">
                            On y est presque
                        </h1>
                        <h2 class="subtitle .text-dark">
                            Merci de remplir ce formulaire pour avoir une démonstration sur-mesure:
                        </h2>

                        <div class="box">
                            <div class="field is-grouped">
                                <p class="control is-expanded">
                                    <input autofocus class="input" type="text" @keypress.enter="launch_demo" v-model="firstname" placeholder="Prenom">
                                </p>
                                <p class="control is-expanded">
                                    <input autofocus class="input" type="text" @keypress.enter="launch_demo" v-model="lastname" placeholder="Nom">
                                </p>
                            </div>
                            <div class="field">
                                <p class="control has-icons-left is-expanded">
                                    <span class="icon is-small is-left">
                                        <i class="fas fa-key"></i>
                                    </span>
                                    <input autofocus class="input" type="password" @keypress.enter="launch_demo" v-model="password" placeholder="Mot de passe">
                                </p>
                            </div>
                            <div class="field">
                                <p class="control has-icons-left is-expanded">
                                    <span class="icon is-small is-left">
                                        <i class="fas fa-building"></i>
                                    </span>
                                    <input autofocus class="input" type="text" @keypress.enter="launch_demo" v-model="residence_name" placeholder="Nom de votre résidence">
                                </p>
                            </div>

                            <div v-if="this.role === 'resi'" class="field">
                                <p class="select control is-expanded" style="width: 100%">
                                    <select v-model="role_selected" style="width: 100%">
                                        <option>Résident</option>
                                        <option>Gardien ou gestionnaire de résidence</option>
                                    </select>
                                </p>
                            </div>
                            <div v-else class="field">
                                <p class="select control is-expanded" style="width: 100%">
                                    <select v-model="role_selected" style="width: 100%">
                                        <option>Gardien ou gestionnaire de résidence</option>
                                        <option>Résident</option>
                                    </select>
                                </p>
                            </div>

                            <div class="field is-grouped">    
                                <p class="control has-icons-left is-expanded">
                                    <input class="input" v-model="email" type="email" placeholder="Email">
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-envelope"></i>
                                    </span>
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
                <span @click="scrollToTop();engage('not engaged')" class="landing-back-button">Retour</span>
                <span class="modimo-lamndind-down"><i class="fa fa-chevron-down fa-2x"/></span>
            </div>

            <div v-else-if="form_state === 'email' && email_error" class="section is-large modimo-clear">
                <div class="container" style="z-index: 1">
                    <div class="column is-6 is-offset-3">
                        <h1 class="title text-dark">
                            Ooooups
                        </h1>
                        <h2 class="subtitle text-dark">
                            Votre email est invalide. Veuiller renseigner une vraie adresse email.
                        </h2>

                        <div class="box">
                            <div class="field is-grouped">
                                <p class="control is-expanded">
                                    <input autofocus @keypress.enter="launch_demo" class="input is-danger" type="text" v-model="email" placeholder="Entre un vrai mail ici">
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

        </div>

        <!-- If the Api is offline, display loader -->
        <div v-else>
            <div class="modimo-clear">
                <nav class="navbar modimo-dark">
                        <div id="navbarMenu" class="navbar-menu">
                            <div class="navbar-end" >
                                <span class="navbar-item">
                                    <a class="button is-outlined" href="/login">
                                        <span class="icon">
                                            <i class="fa fa-key"></i>
                                        </span>
                                        <span>Connexion</span>
                                    </a>
                                </span>
                            </div>
                        </div>
                </nav>
            </div>
                <div class="section is-fullheight is-flex is-horizontal-center is-medium">
                    <h2 class="section title has-text-centered">
                        Chargement...
                    </h2>
                    <figure class="image is-loader  is-128x128 ">
                    <img src="../assets/logo.png">
                    </figure>
                </div>
        </div>
        <contact v-show="showModalContact" @close_modal="showModalContact = false"></contact>

            
        </section>
        <div class="modimo-landing-container">
                <!-- <br/><br/> -->
            <div class="container">
                <br/><br/>
            
                <section class="margin-vertical">
                    <div class="column is-12 is-fullheight">
                        <div class="rows is-mobile">
                                <div class="row columns">
                                    <div class="column is-2">
                                    <img src="/static/img/responsive.png">
                                    </div>
                                    <div class="column has-text-left">
                                    <h1 class="title" style="margin-top: 10px">Toute votre residence à portée de main</h1>
                                    <p class="subtitle" style="margin-top: 10px">Centralisez vos requètes, vos factures, vos taches liées à votre chez-vous dans votre smartphone</p>
                                    </div>
                                </div>
                                <br/>
                                <br/>
                                <div class="row columns">
                                    <div class="column is-2">
                                    <img src="/static/img/time.png">
                                    </div>
                                    <div class="column has-text-left">
                                    <h1 class="title" style="margin-top: 10px">Accelerez la resolution des petits tracas</h1>
                                    <p class="subtitle" style="margin-top: 10px">En suivant les requetes et problèmes des espaces communs de la résidence.</p>
                                    </div>
                                </div>
                                <br/>
                                <br/>
                                <div class="row columns">
                                    <div class="column is-2">
                                    <img src="/static/img/team.png">
                                    </div>
                                    <div class="column has-text-left">
                                    <h1 class="title" style="margin-top: 10px">Reconciliez vous avec votre entourage</h1>
                                    <p class="subtitle" style="margin-top: 10px">Plusieures applis sont a votre disposition pour faciliter la communication entre voisins</p>
                                    </div>
                                </div>
                        </div>
                    </div>
                </section>
                <section class="is-fullheight">
                    <iframe src="https://www.youtube.com/embed/S7A77ClZKcQ" width="100%" height="100%" scrolling="auto" marginwidth="1" style="border-width: 3pt;" frameborder="1" allowfullscreen class="video-aligned"></iframe>
                </section>  
                <br/><br/><br/>
            </div>
        </div>
        <footer class="footer modimo-dark footer-resized">
            <div class="columns">
                <div class="column has-text-centered is-full-mobile">
                    <a class="white" @click="contactModal()">
                    <p class="strong">Nous Contacter</p>
                    </a>
                </div>
                <div class="column has-text-centered is-full-mobile">
                    <p class="strong">Réseaux sociaux:</p>
                    <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'facebook-square' }"/>
                    <a href="https://www.facebook.com/ModimoFR/" class="white">Notre Facebook</a>
                </div>
            </div>
        </footer>
    </div>
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
            firstname: '',
            lastname: '',
            password: '',
            role: 'resi',
            role_selected: '',
            residence_name: '',
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
        scrollToTop() {
            window.scrollTo(0,0);
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
            let conv_roles = this.role_selected == "Resident" ? ["RESIDENT"] : ["CARETAKER"];
            let res = await DemoService.create_demo(this.firstname, this.lastname, this.email, this.password, conv_roles, this.residence_name);
            if (res.data.success) {
                const auth = await AuthService.authenticate(res.data.user.email, res.data.user.password)
                if (auth.data.success) {
                    this.$cookies.set('api_token', auth.data.token)
                    this.$parent.current_user = res.data.user
                    this.$parent.api_token = auth.data.token
                    this.$router.push('home')
                } else {
                    this.$parent.notification = {type: 'failure', message: auth.data.message}
                    this.loading = false
                }
            } else {
                this.email_error = true
                this.loading = false
            }
        /* const demo = this.role === 'resi' ? await DemoService.create_resident_demo(this.email) : await DemoService.create_admin_demo(this.email)
            if (demo.data.success) {
                const auth = await AuthService.authenticate(demo.data.user.email, demo.data.user.password)
                if (auth.data.success) {
                    this.$cookies.set('api_token', auth.data.token)
                    this.$parent.current_user = demo.data.user
                    this.$parent.api_token = auth.data.token
                    this.$router.push('home')
                } else {
                    this.$parent.notification = {type: 'failure', message: auth.data.message}
                    this.loading = false
                }
            } else {
                this.email_error = true
                this.loading = false
            }*/
        },

        contactModal: function () {
            this.showModalContact = true
        }
    }
}
</script>

<style lang="scss">
@import '../styles/landing.scss';
@import '../styles/global.scss'
</style>
