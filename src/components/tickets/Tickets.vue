<style src="./scss/Tickets.scss"></style>
<template>
<!--V-bind:class-->
<!--Status "Open/Close"-->
<!--Give_UserIdtoTicketModal-->
<!--Hover-->
    <section class="section">
        <div class="title has-text-centered">
            Tickets
        </div> <br>
            <div class="tile is-ancestor">
                <div class="tile is-vertical">
                    <div v-for="ticket in tickets" :key="ticket._id" 
                        class="tile is-child background-tile"
                        v-bind:class="{ active: isActive }">
                        <a @click="showModal = true" style="color: #4a4a4a">
                        <div class="columns is-centered">
                            <div class="column is-mobile">
                                <div id="ticket-status" class="has-text-centered bell-status">
                                    <i class="fas fa-bell fa-4x"></i>
                                </div>
                            </div>
                            <div class="column is-one-third is-mobile">
                                <div id="ticket-title" class="has-text-left">
                                    <p class="bold modimo-color"> {{ ticket.title }} </p>
                                    <p class="bold">Crées par : </p> TheYoung Stéph 
                                </div>
                            </div>
                            <div class="column is-one-quarter is-mobile">
                                <div id="ticket-time" class="has-text-left">
                                        <p class="bold">Crées le : </p>
                                        <time datetime="2018-08-13T10:09:26.236Z">13 Aout 2018 - 09:26</time> <br>
                                        <p class="bold">Derniere modification : </p>
                                        <time datetime="2018-08-13T10:12:47.414Z">13 Aout 2018 - 12:47</time>
                                </div>
                            </div>
                            <div class="column is-one-third is-mobile">
                                <div id="ticket-advancement" class="has-text-left">
                                    <p class="bold">Avancement :</p>
                                    <div class="animated-advancement">
                                        <div class="circle"></div>
                                        <div class="circle"></div>
                                        <div class="circle"></div>
                                        <div class="circle"></div>
                                    </div>
                                </div>
                                <div id="ticket-vote" class="has-text-left">
                                    <p class="bold">vote :</p>
                                    <i class="far fa-thumbs-up"></i> 8
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <ticket v-show="showModal" @close_modal="showModal = false"></ticket>
    </section>
</template>

<script>
import ticket from './Ticket.vue'

export default {
    name: 'tickets',
    data () {
        return {
            showModal: false,
            tickets: [
                {
                    '_id': '123133',
                    'title': 'Du feu dans la cheminé',
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
                },
                {
                    '_id': '123144',
                    'title': 'salut jai un probleme',
                    'content': 'mon ascenceur communique avec les sovietique',
                    'author_id': '1238EeGZY4',
                    'residence_id': '1e238aEeGZY4',
                    'status': 'close',
                    'created_at': {
                        '$date': '2018-08-14T10:09:26.236Z'
                    },
                    'updated_at': {
                        '$date': '2018-08-14T10:12:47.414Z'
                    },
                    'comments': [
                        {
                            '_id': '123133',
                            'author_id': 'oji23oijzea3',
                            'content': 'cest un vrai faux probleme',
                            'created_at': {
                                '$date': '2018-08-15T10:09:26.236Z'
                            },
                            'updated_at': {
                                '$date': '2018-08-15T10:12:47.414Z'
                            }
                        }
                    ],
                    'votes': [
                        '123144'
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
