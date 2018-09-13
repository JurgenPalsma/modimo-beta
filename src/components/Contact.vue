<template>
    <section>
        <div class="modal is-active">
            <div class="my-modal-background modal-background" style="opacity:50%;" @click="$emit('close_modal')"></div>
            <div class="modal-content">
                <div class="box">
                    <button class="delete is-pulled-right" aria-label="close" @click="$emit('close_modal')"></button>
                    <div class="media-content">
                        <div class="content">
                            <strong class="modimo-color modimo-size ">Formulaire de Contact</strong>
                            <br>
                            <br>
                            <div class="field">
                                <label class="label">Nom</label>
                                <div class="control">
                                    <input class="input" type="text" placeholder="Votre Nom" v-model="contactName" ref="contactName">
                                </div>
                                </div>

                                <div class="field">
                                <label class="label">Mail</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input class="input" type="email" placeholder="Votre Mail" v-model="contactMail" ref="contactMail">
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
                                    <textarea class="textarea" placeholder="Votre Texte" v-model="contactMessage" ref="contactMessage"></textarea>
                                </div>
                                </div>

                                <div class="field is-grouped">
                                <div class="control">
                                    <button @click="submitContactHandler()" class="button is-link">Envoyer</button>
                                </div>
                                <div class="control">
                                    <button class="button is-text">Annuler</button>
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

import ContactService from '@/services/ContactService'

export default {
    name: 'contact',
    data () {
        return {
            contactName: '',
            contactMail: '',
            contactMessage: ''
        }
    },
    methods: {
        submitContactHandler: async function () {
            if (this.contactName.length === 0) {
                this.$refs.contactName.placeholder = 'Name: Mandatory'
            } else if (this.contactMail.length === 0) {
                this.$refs.contactMail.placeholder = 'Email: Mandatory'
            } else if (this.contactMessage.length === 0) {
                this.$refs.contactMessage.placeholder = 'Message: Mandatory'
            } else {
                const resp = await ContactService.postContact(this.contactName, this.contactMail, this.contactMessage)
                if (resp.data.success) {
                    this.$emit('close_modal')
                    this.$parent.$parent.notification = {type: 'success', message: 'Message envoyé'}
                } else {
                    this.$parent.$parent.notification = {type: 'failure', message: "L'envoi du mail a échoué"}
                }
            }
        }
    }
}
</script>
<style lang="scss" src="./tickets/scss/Tickets.scss">       
</style>