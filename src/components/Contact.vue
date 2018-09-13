<template>
    <section>
        <div class="modal is-active">
            <div class="my-modal-background modal-background" style="opacity:50%;" @click="$emit('close_modal')"></div>
            <div class="modal-content">
                <div class="box">
                    <button class="delete is-pulled-right" aria-label="close" @click="$emit('close_modal')"></button>
                    <div class="media-content">
                        <div class="content">
                            <strong class="modimo-color modimo-size">Formulaire de Contact</strong>
                            <br>
                            <div class="field">
                                <label class="label">Nom</label>
                                <div class="control">
                                    <input class="input" type="text" placeholder="Votre Nom" v-model="contactName">
                                </div>
                                </div>

                                <div class="field">
                                <label class="label">Mail</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input class="input" type="email" placeholder="Votre Mail" v-model="contactMail">
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-envelope"></i>
                                    </span>
                                    <!-- <span class="icon is-small is-right">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    </span> -->
                                </div>
                                </div>

                                <div class="field">
                                <label class="label">Message</label>
                                <div class="control">
                                    <textarea class="textarea" placeholder="Votre Texte" v-model="contactMessage"></textarea>
                                </div>
                                </div>

                                <div class="field is-grouped">
                                <div class="control">
                                    <button @click="submitContactHandler()" class="button is-link">Envoyer</button>
                                </div>
                                <div class="control">
                                    <button class="button is-text">Cancel</button>
                                </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>

import ContactService from '@/services/TicketService'

export default {
    name: 'contact',
    data () {
        return {
            contactName: '',
            contactMail: '',
            contactMessage: '',
            contact_inputs: true
        }
    },
    methods: {
        submitContactHandler: async function () {
            if (this.contactName.length === 0) {
                this.$refs.contactName.placeholder = 'Name: Mandatory'
                this.contact_inputs = false
            } else if (this.contactMail === 0) {
                this.$refs.contactMail.placeholder = 'Email: Mandatory'
                this.contact_inputs = false
            } else {
                const resp = await ContactService.postContact(this.contactName, this.contactMail, this.contactMessage)
                if (resp.data.success) {
                    this.emit('close_modal')
                } else {
                    alert('Something went Wrong while posting contact')
                }
            }
        }
    }
}
</script>
<style lang="scss" src="./tickets/scss/Tickets.scss">       
</style>