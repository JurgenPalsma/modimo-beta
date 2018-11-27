<template>
    <section>
        <div class="modal is-active">
            <div class="modal-background" @click="$emit('close_modal')"></div>
                <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Bienvenue</p>
                    <button class="delete" aria-label="close" @click="$emit('close_modal')"></button>
                </header>
                <section class="modal-card-body">
                    <div>
                        

                    </div>
                    <div class="field">
                        <label class="label">
                            <p> Cette page recense des statistiques sur vos perfomances pour l'application "Tickets". </p>
                            <p> Nous allons ajouter des statistiques au fur et a mesure. N'hésitez pas a nous faire un retour sur les statistiques vous aimeriez voir!</p>
                        </label>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button" @click="$emit('close_modal')">J'ai compris</button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>

export default {
    name: 'firstTimeModal',
    data () {
        return {
            isActive: true
        }
    },
    methods: {
        readIntro: function () {  
            this.$parent.first_time_modal;
        }
    }
}
</script>

<style lang="scss">

</style>