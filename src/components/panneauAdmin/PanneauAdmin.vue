<style lang="scss">
@import '../../styles/global.scss';
</style>
<template>
  <div class="columns is-multiline">
      <div v-for="user in users" :key="user._id" class="column modimo-tiny-padding is-12">
          <div class="modimo-tile">
            <p class="bold modimo-content-size is-text-overflow">par <span class="no-bold">{{user.name}}</span></p>
          </div>
      </div>
  </div>
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
      showModalUserCreation: false,
    }
  },

  created: function () {
  },
  mounted: function () {
      this.load()
  },
  methods: {
    closeModalUserCreation: function(user) {
        if (user) {
            this.users.push(user);
            this.$parent.notification = {type: 'success', message: 'Utilisateur créé avec succès !'}
        }
        this.showModalUserCreation = false;
    },

    async load () {
        this.current_user = await this.$parent.getCurrentUser()
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
