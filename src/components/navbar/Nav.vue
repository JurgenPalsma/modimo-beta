<template>
    <section>

        <nav v-if="$route.name != 'Landing'" class="navbar">

            <div class="navbar-brand">
                <a class="navbar-item" href="/home">
                    <img src="/static/img/icons/logo.png" alt="Modimo">
                    <span v-if="$route.name != 'Home'" class="is-hidden-touch">&nbsp;Accueil</span>
                </a>

                <div v-if="$route.name != 'Login'" class="navbar-burger burger" data-target="navMenubd-example">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <div id="navMenubd-example" class="navbar-menu">
                <div v-if="$route.name != 'Home' && $route.name != 'Login'" class="navbar-start">
                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link" href="/home">Apps</a>
                        <div class="navbar-dropdown ">
                            <a class="navbar-item " href="/tickets">Tickets</a>
                            <a class="navbar-item" href="/analytics">Statistiques</a>
                        </div>
                    </div>
                </div>

                <div v-if="$route.name != 'Login'" class="navbar-end">
                    <div @userdata="load()" v-if="current_user && current_user.roles && (current_user.roles.includes('ROOT') || current_user.roles.includes('CARETAKER') || current_user.roles.includes('ADMIN'))" class="navbar-item">
                        <div class="field is-grouped">
                            <p class="control" @click='mailerModal()'>
                                <a class="button">
                                <span class="icon">
                                    <i class="fa fa-envelope"></i>
                                </span>
                                <span>Envoyer un mail</span>
                                </a>
                            </p>
                        </div>
                    </div>
                    <div class="navbar-item">
                        <div class="field is-grouped">
                            <p class="control" @click="notifModal()">
                                <a class="button">
                                <span class="icon">
                                    <i class="fa fa-bell"></i>
                                </span>
                                <span>Notifications</span>
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
                                <span>Déconnection</span>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <mailer v-show="showMailerModal" @close_modal="showMailerModal = false"></mailer>
        <notif :info="selectedInformation" v-show="showNotifModal" @close_modal="showNotifModal = false"></notif>
    </section>
</template>

<script>
import AuthService from '@/services/AuthService'
import NotificationService from '@/services/NotificationService'
import Mailer from '../mails/Mailer.vue'
import Notifications from '../notifications/notifications.vue'

export default {
    name: 'navbar',
    data () {
        return {
            showMailerModal: false,
            showNotifModal: false,
            current_user: null,
            selectedInformation: undefined,
            notifs: [],
        }
    },

    created: function () {
  },

  updated: function () {
      this.load();
  },

    mounted () {
        this.load()
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
        });
    },
    methods: {
        async load() {
            this.current_user = await this.$parent.getCurrentUser()
            const resp = await NotificationService.getNotifications(this.$cookies.get('api_token'));
            if (resp.data.success) {
                this.notifs = resp.data.notifications
            } else {
                this.$parent.notification = {type: 'failure', message: 'Erreur lors de la récupération des tickets'}
            }
        },
        logout: function () {
            AuthService.logout(this.$cookies.get('api_token'))
            this.$cookies.remove('api_token')
            this.$router.push('/')
        },

        mailerModal: function () {
          this.showMailerModal = true
        },
        notifModal: function () {
          console.log("click on notif");
          this.showNotifModal = true
        }
    },

    components: {
        'mailer': Mailer,
        'notif': Notifications
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
