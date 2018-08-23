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
                {
                    '_id': '123133',
                    'title': 'salut jai un réel probleme',
                    'content': 'mon ascenceur est cassé',
                    'author_id': '1238EeGZY3',
                    'residence_id': '1e238aEeGZY3',
                    'status': 'open',
                    'created_at': {
                        '$date': '2018-08-13T10:09:26.236Z'
                    },
                    'updated_at': {
                        '$date': '2018-08-13T10:12:47.414Z'
                    },
                    'comments': [
                        {
                            '_id': '123133',
                            'author_id': 'oji23oijzea3',
                            'content': 'cest un vrai probleme',
                            'created_at': {
                                '$date': '2018-08-14T10:09:26.236Z'
                            },
                            'updated_at': {
                                '$date': '2018-08-14T10:12:47.414Z'
                            }
                        }
                    ],
                    'votes': [
                        '123133'
                    ]
                }
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
