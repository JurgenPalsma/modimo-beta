<template>
  <section class="hero is-info">
    <div class="container is-fluid">
    <div class="notification">
      This container is <strong>fluid</strong>: it will have a 32px gap on either side, on any
      viewport size.
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
