<template>
  <section class="hero is-info is-fullheight">
    <div class="section container">
      <div :v-for="t in tickets">
        <ticket> </ticket>
      </div>
    </div>
</section>
</template>

<script>
import ticket from './Ticket.vue'

export default {
  name: 'tickets',
  data () {
    return {
      tickets: [
        {'nameo': 'slt'}
      ]
    }
  },
  components: {
    'ticket': ticket
  }
}
</script>

<style lang="scss">

</style>
