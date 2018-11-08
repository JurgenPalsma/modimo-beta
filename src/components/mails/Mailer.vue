<template>
    <section class="hero is-fullheight-minus-navbar modimo-dark">
        <div class="hero-body">
            <div class="container">           
                <div class="box">
                    <button class="delete is-pulled-right" aria-label="close" @click="$emit('close_modal')"></button>
                    <div class="media-content">
                        <div class="content">
                            <strong class="modimo-color modimo-size ">Envoi de mail</strong>
                            <br>
                            <br>
                            <div class="field">
                                <label class="label">Titre</label>
                                <div class="control">
                                    <input class="input" type="text" v-model="mail.title">
                                </div>
                                </div>

                                <div class="field">
                                <label class="label">Destinataire</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input class="input" type="email" v-model="mail.to" ref="contactMail">
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
                                    <textarea class="textarea" placeholder="Votre Texte" v-model="mail.description"></textarea>
                                </div>
                                </div>

                                <div class="field is-grouped">
                                <div class="control">
                                    <button @click="createMail()" class="button is-link">Envoyer</button>
                                </div>
                                <div class="control">
                                    <button class="button is-text" @click="$emit('close_modal')">Annuler</button>
                                </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>     
    </section>
</template>


<style lang="scss" src="../tickets/scss/Tickets.scss">       
</style>

<script>
import MailService from '@/services/MailService'

export default {
  data () {
    return {
      mail: {
        to:"",
        title: "",
        description: ""
      },
      currentUser: {}
    }
  },

  created: function () {
  },

  methods: {

      createMail: function() {
        if (!this.mail.title || !this.mail.description || !this.mail.to)
          return alert("Un champ est manquant?");
        MailService.postMail(this.$cookies.get('api_token'), this.mail.title, this.mail.description, this.mail.to)
        .then(response => {
                if (!response.data.success)
                    this.$parent.$parent.notification = {type: 'failure', message: "Echec de l'envoi"}
                else
                {
                    this.$parent.$parent.notification = {type: 'success', message: "Email Envoyé"}
                    this.$emit('close_modal');
                }
            });
    }
  }
}
</script>

