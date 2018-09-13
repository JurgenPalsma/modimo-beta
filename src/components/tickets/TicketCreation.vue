<template>
    <section>
        <div class="modal is-active">
            <div class="modal-background" @click="$emit('close_modal')"></div>
                <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Nouveau Ticket</p>
                    <button class="delete" aria-label="close" @click="$emit('close_modal')"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">Titre</label>
                        <div class="control">
                            <input class="input" type="text" v-model="title" placeholder="Titre du ticket...">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Message</label>
                        <div class="control">
                            <textarea class="textarea" v-model="content" placeholder="Message du ticket..."></textarea>
                        </div>
                    </div>                
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="postTicket">Créer</button>
                    <button class="button" @click="$emit('close_modal')">Annuler</button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>
import TicketService from '@/services/TicketService'

export default {
    name: 'ticketCreation',
    data () {
        return {
            title: '',
            content: '',
            isActive: true
        }
    },
    methods: {
            
        postTicket: function () {
            TicketService.postTicket(this.$cookies.get('api_token'), this.title, this.content)
            .then(response => {
                if (!response.data.success || !response.data.ticket)
                    this.$parent.$parent.notification = {type: 'failure', message: "Un champ est manquant"}
                else
                    this.$emit('close_modal', response.data.ticket);
            })
        }

    }
}
</script>

<style lang="scss">

</style>