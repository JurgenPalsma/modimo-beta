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
import TicketService from '@/services/TicketService'

export default {
    name: 'Ticket',
    data () {
        return {
            //  Maybe not the type but data?
            tickets: [],
            showModalTicket: false,
            showModalTicketCreation: false,
            author_id: '',
            title: '',
            content: '',
            votes: '',
            comments: '',
            created_at: null,
            updated_at: null,
            status: '',
            residence_id: ''
            //  not the type, empty data
        }
    },
    mounted: function () {
        this.load() //  plusieurs fonctions appelées-> composant monté load la data
    },
    methods: {
        async load () {
            this.current_user = await this.$parent.getCurrentUser()
            const resp = await TicketService.getTicket(this.$cookies.get('api_token'), this.ticket_id)
            if (resp.data.success) {
                this.author_id = resp.data.author_id
                this.title = resp.data.title
                this.content = resp.data.content
                this.votes = resp.data.votes
                this.comments = resp.data.comments
                this.created_at = resp.data.created_at
                this.updated_at = resp.data.updated_at
                this.status = resp.data.status
                this.residence_id = resp.data.residence_id
            } else {
                alert('Something went wrong with ticket data')
            }
        },

        idToModal: function (ticket) {
            this.currentTicket = ticket
            this.showModalTicket = true
        }
    },
    components: {
        'ticket': ticket,
        'ticketCreation': ticketCreation
    }
}
</script>

<style lang="scss">

</style>
