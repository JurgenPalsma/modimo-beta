<style src="./scss/Tickets.scss"></style>
<template>
<!--Give_UserIdto Component-->
    <section class="section">
        <div class="title has-text-centered">
            Tickets
            <a @click="showModalTicketCreation = true" class="super-button">+</a>
        </div> 
        <br>
            <div class="tile is-ancestor">
                <div class="tile is-vertical">
                    <div v-for="ticket in tickets" :key="ticket._id" 
                        class="tile is-child background-tile">
                        <a @click="idToModal(ticket)" style="color: #4a4a4a">
                        <div class="columns is-centered">
                            <div class="column is-mobile">
                                <div id="ticket-status" class="has-text-centered icon-status">
                                    <i v-if="ticket.status === 'open'" class="fas fa-bell fa-3x"></i>
                                    <i v-else-if="ticket.status === 'close'" class="fas fa-lock fa-3x"></i>
                                </div>
                            </div>
                            <div class="column is-one-third is-mobile">
                                <div id="ticket-title" class="has-text-left title-section">
                                    <p class="bold modimo-color modimo-size"> {{ ticket.title }} </p>
                                    <p class="bold">Créé par : </p> TheYoung Stéph 
                                </div>
                            </div>
                            <div class="column is-one-quarter is-mobile">
                                <div id="ticket-time" class="has-text-left">
                                        <p class="bold">Créé le : </p>
                                        <time datetime="2018-08-13T10:09:26.236Z">13 Aout 2018 - 09:26</time> <br>
                                        <p class="bold">Derniere modification : </p>
                                        <time datetime="2018-08-13T10:12:47.414Z">13 Aout 2018 - 12:47</time>
                                </div>
                            </div>
                            <div class="column is-one-third is-mobile">
                                <div id="ticket-advancement" class="has-text-left">
                                    <p class="bold">Avancement :</p>
                                    <div v-if="ticket.status === 'open'" class="animated-advancement">
                                        <div class="circle-inProcess"></div>
                                        <div class="circle-inProcess"></div>
                                        <div class="circle-inProcess"></div>
                                        <div class="circle-inProcess"></div>
                                    </div>
                                    <div v-else-if="ticket.status === 'close'" class="animated-advancement">
                                        <div class="circle-processDown"></div>
                                    </div>
                                </div>
                                <div id="ticket-vote" class="has-text-left">
                                    <p class="bold">vote :</p>
                                    <i class="far fa-thumbs-up"></i> 8
                                </div>
                            </div>
                        </div>
                    </a>
                  <ticket :ticket="currentTicket" v-show="showModalTicket" @close_modal="showModalTicket = false"></ticket>
                </div>
            </div>
        </div>
        <ticketCreation v-show="showModalTicketCreation" @close_modal="showModalTicketCreation = false"></ticketCreation>
    </section>
</template>

<script>
import ticket from './Ticket.vue'
import ticketCreation from './TicketCreation.vue'

export default {
    name: 'tickets',
    data () {
        return {
            showModalTicket: false,
            showModalTicketCreation: false,
            currentTicket: {},
            tickets: [
                {
                    '_id': '123133',
                    'title': 'Du feu dans la cheminée',
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
                    'title': 'Ampoule cassée',
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
        'ticket': ticket,
        'ticketCreation': ticketCreation
    },

    methods: {
        idToModal: function (ticket) {
            this.currentTicket = ticket
            this.showModalTicket = true
        }
    }
}
</script>

<style lang="scss">

</style>
