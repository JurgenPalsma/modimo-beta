<template>
    <section>

        <nav v-if="this.$route.name != 'Landing' && this.$route.name != 'Login'" class="navbar">

            <div class="navbar-brand">
                <a class="navbar-item" href="/home">
                    <img src="/static/img/icons/logo.png" alt="Modimo">
                    <span class="is-hidden-touch">&nbsp;Accueil</span>
                </a>

                <div class="navbar-burger burger" data-target="navMenubd-example">
                <span></span>
                <span></span>
                <span></span>
                </div>
            </div>

            <div id="navMenubd-example" class="navbar-menu">
                <div v-if="this.$route.name != 'Home'" class="navbar-start">
                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link" href="/home">Apps</a>
                        <div class="navbar-dropdown ">
                            <a class="navbar-item " href="/tickets">Tickets</a>
                            <a class="navbar-item" href="/analytics">Statistiques</a>
                        </div>
                    </div>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="field is-grouped">
                            <p class="control" @click='mailerModal()'>
                                <a class="button">
                                <span class="icon">
                                    <i class="fa fa-envelope"></i>
                                </span>
                                <span>Mailer</span>
                                </a>
                            </p>
                        </div>
                    </div>
                    <div class="navbar-item">
                        <div class="field is-grouped">
                            <p class="control" @click="logout">
                                <a class="button">
                                <span class="icon">
                                    <i class="fa fa-lock"></i>
                                </span>
                                <span>Déconnexion</span>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
        </nav>
        <contact v-show="showMailerModal" @close_modal="showMailerModal = false"></contact>
    </section>
</template>

<script>
import AuthService from '@/services/AuthService'
import Mailer from '../mails/Mailer.vue'
export default {
    name: 'navbar',
    showMailerModal: false,
    mounted () {
        document.addEventListener('DOMContentLoaded', function () {
            var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0)
            if ($navbarBurgers.length > 0) {
                $navbarBurgers.forEach(function ($el) {
                    $el.addEventListener('click', function () {
                        var target = $el.dataset.target
                        var $target = document.getElementById(target)
                        $el.classList.toggle('is-active')
                        $target.classList.toggle('is-active')
                    })
                })
            }
        })
    },
    methods: {
        logout: function () {
            AuthService.logout(this.$cookies.get('api_token'))
            this.$cookies.remove('api_token')
            this.$router.push('/')
        }
    },
    mailerModal: function () {
        this.showMailerModal = true
    }
}
</script>

<style lang="scss">
.navbar-item.is-mega {
  position: static;

  .is-mega-menu-title {
    margin-bottom: 0;
    padding: .375rem 1rem;
  }
}
</style>
