<template>
    <section>
        <div class="modal is-active">
            <div class="my-modal-background modal-background" style="opacity:50%;" @click="$emit('close_modal')"></div>
            <div class="modal-content">
                <div class="box">
                    <button class="delete is-pulled-right" aria-label="close" @click="$emit('close_modal')"></button>
                    <div class="media-content">
                        <div class="content">
                          <div v-if="!info || info.length === 0">
                            <strong class="modimo-color modimo-size ">Vous n'avez pas de notifications</strong>
                          </div>
                          <div v-else-if="info.length === 1">
                            <strong class="modimo-color modimo-size ">Vous avez une nouvelle notification</strong>
                          </div>
                          <div v-else>
                            <strong class="modimo-color modimo-size ">Vous avez {{info.length}} notifications</strong>
                          </div>
                            <br>
                            <br>
                            <div class="field" v-for="inf in info" :key="inf._id">
                                <label style="is-right" class="label">{{inf.title}}</label>
                                <hr>
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

  },
  created: function () {
  }
}
</script>
