<template>
    <section>
        <div class="modal is-active">
            <div class="modal-background" @click="$emit('close_modal')"></div>
                <div class="modal-card" style="overflow:initial">
                <header class="modal-card-head">
                    <div style="display: flex">
                        <p class="modal-card-title">{{gameState === 'WIN' ? "Bien joué!" : "Dommage..."}}</p>
                        <button class="delete" aria-label="close" @click="$emit('close_modal')"></button>
                    </div>
                </header>
                <section class="modal-card-body" style="overflow:initial">
                    <div>
                        

                    </div>
                    <div class="field">
                      <label class="label" style="text-align: center">
                        <div v-if="gameState == 'WIN'">
                          <p style="text-align: left; font-weight: 100">Il s'agit bien de <span style="text-align: left; font-weight: 600">Jeremy Malfoy</span>!</p>
                          <p style="text-align: left; font-weight: 100">Ses enfants était présent tout le week-end à la résidence et la porte n'a pas cessé d'être ouverte...</p>
                          <p style="text-align: left; font-weight: 100"><br/>Une petite récompense vous attend, venez la récupérer à notre stand!</p>
                          <p style="text-align: left; font-weight: 100"><br/>Il s'agissait bien sure d'une situation fictive vous permettant avant tout de découvrir Modimo. Seriez-vous prêt à revivre l'expérience au sein d'une réelle résidence? Partagez votre avis avec nous, nous serions ravis de l'entendre et d'en rediscuter plus amplement!</p>
                          <p style="text-align: left; font-weight: 100"><br/>Merci d'avoir pris le temps de découvrir notre plateforme.<br/><br/>Modimo<br/><a href="mailto:modimoteam@gmail.com" style="color: #2b5bb2">modimoteam@gmail.com</a></p>
                        </div>
                        <div v-else>
                          <p style="text-align: left; font-weight: 100">Le responsable était <span style="text-align: left; font-weight: 600">Jeremy Malfoy.</span></p>
                          <p style="text-align: left; font-weight: 100">Plusieurs personnes de la résidence souspconnaient ces enfants et ce sont presque les seuls a avoir été présent le week-end où la porte est restée ouverte.</p>
                          <p style="text-align: left; font-weight: 100"><br/>Ouf, il s'agissait bien sure d'une situation fictive vous permettant avant tout de découvrir Modimo. Seriez-vous prêt à revivre l'expérience au sein d'une réelle résidence?</p>
                          <p style="text-align: left; font-weight: 100">Partagez votre avis avec nous, nous serions ravis de l'entendre et d'en rediscuter plus amplement!</p>
                          <p style="text-align: left; font-weight: 100"><br/>Merci d'avoir pris le temps de découvrir notre plateforme.<br/><br/>Modimo<br/><a href="mailto:modimoteam@gmail.com" style="color: #2b5bb2">modimoteam@gmail.com</a></p>
                        </div>
                      </label>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button" @click="$emit('close_modal')">{{gameState === "WIN" ? "Récupérer ma récompense" : "Retour"}}</button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>
import UserService from '@/services/UserService'

export default {
    name: 'EndGameModal',
    data () {
        return {
            isActive: true,
            residents: [],
            index: 0,
            dropdownVisible: false
        }
    },
    created: function() {
      // this.load();
    },
    methods: {
    },
    props: ['gameState']
}
</script>

<style lang="scss">

</style>