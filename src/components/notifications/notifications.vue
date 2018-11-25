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
                                <label class="label" v-model="info.notifs.title"></label>
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
export default {
  props: ["info"],
  data () {
    return {
    }
  },
  methods: {

  }
}
</script>
