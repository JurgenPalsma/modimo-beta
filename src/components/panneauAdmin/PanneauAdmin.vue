<style lang="scss">
@import './style/panneauAdmin.scss';
@import '../../styles/global.scss';
</style>
<template>
<section class="hero modimo-dark is-fullheight-minus-navbar">
    <div class="container">
        <aside class="menu">
            <a @click="showModalUserCreation = true" class="super-button">+</a>
            <p class="title has-text-centered white-title">
                Liste des utilisateurs
            </p>
            <div style="margin-top:50px; margin-left:250px;">
                <div v-for="user in users" :key="user._id">
                    <ul class="menu-list">
                        <li>
                            <div class="columns">
                                <div class="column">
                                {{user.name}}
                                </div>
                                  <div class="column" style="margin-left:40px;">
                                    <a class="button is-danger is-rounded" style="width: 35%;" @click="deleteUser(user._id)">Supprimer</a>
                                    </a>
                                  </div>
                            </div>
                            <hr style="width: 70%;">
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    </div>
    <userCreation :info="selectedInformation" v-show="showModalUserCreation" @close_modal="closeModalUserCreation"></userCreation>
</section>
</template>
<script>
import UserService from '@/services/UserService'
import userCreation from './UserCreation.vue'

export default {
  name: 'User',
  data () {
    return {
      users: [],
      currentUser: {},
      selectedInformation: undefined,
      showModalUserCreation: false,
    }
  },

  created: function () {
  },
  mounted: function () {
      this.load()
  },
  components: {
      'userCreation': userCreation
  },
  methods: {
    closeModalUserCreation: function(user) {
        if (user) {
            this.users.push(user);
            this.$parent.notification = {type: 'success', message: 'Utilisateur créé avec succès !'}
        }
        this.showModalUserCreation = false;
    },
    deleteUser: function(user_id) {
      if (confirm("Êtes vous sûr de vouloir supprimer ce résident?")) {
        const resp = UserService.deleteUser(this.$cookies.get('api_token'), user_id);
        } else {}
      this.load();
    },
    async load () {
        this.current_user = await this.$parent.getCurrentUser()
        this.selectedInformation = this.current_user;
        const resp = await UserService.getUsers(this.$cookies.get('api_token'), this.current_user.residence._id)
        if (resp.data.success) {
            this.users = resp.data.users;
        } else {
            this.$parent.notification = {type: 'failure', message: 'Erreur lors du chargement des données'}
        }
    }
  }
}
</script>
