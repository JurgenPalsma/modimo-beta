<template>
    <section>
        <div class="modal is-active">
            <div class="modal-background" @click="$emit('close_modal')"></div>
                <div class="modal-card" style="overflow:initial">
                <header class="modal-card-head">
                    <div style="display: flex">
                        <p class="modal-card-title">Résoudre l'affaire</p>
                        <button class="delete" aria-label="close" @click="$emit('close_modal')"></button>
                    </div>
                </header>
                <section class="modal-card-body" style="overflow:initial">
                    <div>
                        

                    </div>
                    <div class="field">
                      <label class="label" style="text-align: center">
                        <p style="text-align: left; margin-bottom: 10px">Avez-vous trouvé le responsable?</p>
                        <p style="text-align: left; font-weight: 100">Si vous pensez avoir trouvé la personne coupable dans cette affaire, sélectionnez-la dans la liste pour clore le ticket.</p>
                        <div style="margin-top: 20px;margin-bottom: 20px" class="dropdown" :class="dropdownVisible ? 'is-active' : ''" @click="dropdownVisible = !dropdownVisible">
                            <div class="dropdown-trigger">
                                <button class="button is-fullwidth" aria-haspopup="true" aria-controls="dropdown-game">
                                <span>{{this.residents[this.index] ? this.residents[this.index].name : ''}}</span>
                                <span class="icon is-small">
                                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                                </span>
                                </button>
                            </div>
                            <div class="dropdown-menu" id="dropdown-menu" role="menu">
                              <div class="dropdown-content" style="text-align: left">
                                <a v-for="(resident, ndx) in residents" :key="resident._id" @click="index = ndx; dropdownVisible = false" class="dropdown-item" :class="index === ndx ? 'is-active' : ''">
                                    {{resident.name}}
                                </a>
                              </div>
                            </div>
                        </div>
                        <p style="text-align: left; font-weight: 100">Êtes vous sure de votre réponse ?<br/>Le jeu se terminera dès que vous avez envoyé votre réponse et la solution vous sera dévoilée.</p>
                      </label>
                    </div>
                </section>
                <footer class="modal-card-foot" style="justify-content: center">
                    <button class="button" @click="$emit('close_modal', residents[index].name)">Je confirm ma réponse</button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>
import UserService from '@/services/UserService'

export default {
    name: 'GameModal',
    data () {
        return {
            isActive: true,
            residents: [],
            index: 0,
            dropdownVisible: false
        }
    },
    created: function() {
      this.load();
    },
    methods: {
      async load() {
        const resp = await UserService.getUsers(this.$cookies.get('api_token'), this.$parent.$parent.$parent.currentUser.residence._id)
        if (resp.data.success) {
          this.residents = resp.data.users.filter(user => !user.roles || (!user.roles.includes("CARETAKER") && !user.roles.includes("ADMIN")));
        }
      }
    }
}
</script>

<style lang="scss">

</style>