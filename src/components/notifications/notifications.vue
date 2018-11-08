<template>
    <section>
        <div class="modal is-active">
            <div class="my-modal-background modal-background" style="opacity:50%;" @click="$emit('close_modal')"></div>
            <div class="modal-content">
                <div class="box">
                    <button class="delete is-pulled-right" aria-label="close" @click="$emit('close_modal')"></button>
                    <div class="media-content">
                        <div class="content">
                            <strong class="modimo-color modimo-size ">Notifications</strong>
                            <br>
                            <br>
                            <div class="field">
                                <label class="label" v-model="notif.title">Titre</label>
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
//import NotificationService from '@/services/NotificationService'

export default {
  data () {
    return {
      notif: {
        title: "",
        actorName: "",
      },
      currentUser: {}
    }
  },

  created: function () {
  },

  methods: {

      //GETNOTIF
  }
}
</script>
