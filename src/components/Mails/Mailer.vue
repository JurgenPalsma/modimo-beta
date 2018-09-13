<template>
    <section>
        <div class="modal is-active">
            <div class="my-modal-background modal-background" style="opacity:50%;" @click="$emit('close_modal')"></div>
            <div class="modal-content">
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
<style scoped>

.new-ticket-title {
  margin-top: 30px;
  display: inline-block;
  width: 75%;
}


.new-ticket-title::placeholder {
  font-size: 36px;
  line-height: 42px;
}

.backbutton {
  display: inline-block;
  width: 100%;
}

.new-ticket-description {
  width: 70%;
  display: inline-block;
  min-height: 200px;
}

.create-ticket-button {
  width: 100%;
}

</style>


<script>
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
          return alert("Missing something ?");

        this.$http.post(this.$config.api + '/mail', {
        subject: this.mail.title,
        text: this.mail.description,
        to: this.mail.to },
        {headers: {'x-access-token': this.$cookies.get('dev-api-token')}}).then(response => {
          if (response.body.success) {
            this.mail.title = '';
            this.mail.description = '';
            this.mail.to = '';
            return alert("success " + response.body.message);
          }
          else
            alert(response.body.message);
        }, response => {
          alert("DEBUG: something went wrong while sending mail " + response.body.message)
      });
    }
  },
}
</script>

