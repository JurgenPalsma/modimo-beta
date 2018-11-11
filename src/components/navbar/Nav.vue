<template>
    <section>

        <nav v-if="$route.name != 'Landing'" class="navbar modimo-navbar">

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
                        <div class="navbar-dropdown">
                            <a class="navbar-item" v-for="app in applications" :key="app._id" :href="app.link">{{app.shortname}}</a>
                            <!-- <a class="navbar-item" href="/analytics">Statistiques</a>
                            <a class="navbar-item" href="/billboard">Mur d'affiche</a> -->
                        </div>
                    </div>
                </div>

                <div v-if="$route.name != 'Login'" class="navbar-end">
                    <div @userdata="load()" v-if="currentUser && currentUser.roles && (currentUser.roles.includes('ROOT') || currentUser.roles.includes('CARETAKER') || currentUser.roles.includes('ADMIN'))" class="navbar-item">
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
                                <span>Déconnexion</span>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <notif v-show="showNotifModal" @close_modal="showNotifModal = false"></notif>
    </section>
</template>

<script>
import AuthService from "@/services/AuthService";
import Notifications from "../notifications/notifications.vue";
import ModistoreService from '@/services/ModistoreService'

export default {
  name: "navbar",
  data() {
    return {
      showNotifModal: false,
      applications: null
    };
  },

  created: function() {
    this.load();
    document.addEventListener("DOMContentLoaded", function() {
      var $navbarBurgers = Array.prototype.slice.call(
        document.querySelectorAll(".navbar-burger"),
        0
      );
      if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(function($el) {
          $el.addEventListener("click", function() {
            var target = $el.dataset.target;
            var $target = document.getElementById(target);
            $el.classList.toggle("is-active");
            $target.classList.toggle("is-active");
          });
        });
      }
    });
  },

    watch: {
        '$parent.currentUser' : function (newCurrentUser) {
            this.currentUser = newCurrentUser
            this.load();
        },
    },
  methods: {
    async load() {
        ModistoreService.getMyInstalledApplications(this.$cookies.get('api_token'))
        .then(response => {
            this.applications = response.data.applications;
        })
    },
    logout: function() {
      AuthService.logout(this.$cookies.get("api_token"));
      this.$cookies.remove("api_token");
      this.$router.push("/");
      this.$parent.currentUser = null;
    },

    notifModal: function() {
      this.showNotifModal = true;
    }
  },

    props: ['currentUser'],
  components: {
    notif: Notifications
  }
};
</script>

<style lang="scss">
.navbar-item.is-mega {
  position: static;

  .is-mega-menu-title {
    margin-bottom: 0;
    padding: 0.375rem 1rem;
  }
}
@import "../../styles/global.scss";
</style>
