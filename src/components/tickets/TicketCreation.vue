<template>
    <section>
        <div class="modal is-active">
            <div class="modal-background"></div>
                <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Nouveau Ticket</p>
                    <button class="delete" aria-label="close" @click="$emit('close_modal')"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">Titre</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Titre du ticket...">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Message</label>
                        <div class="control">
                            <textarea class="textarea" placeholder="Message du ticket..."></textarea>
                        </div>
                    </div>                
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success">Save changes</button>
                    <button class="button" @click="$emit('close_modal')">Cancel</button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'ticketCreation',
    data () {
        return {
            isActive: true
        }
    },
    methods: {

    }
}
</script>

<style lang="scss">

</style>