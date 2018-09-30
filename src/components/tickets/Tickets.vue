<style lang="scss">
@import './scss/Tickets.scss';
@import '../../styles/global.scss';
</style>

<template>
<!--Give_UserIdto Component-->
    <section class="section is-fullheight-minus-navbar modimo-dark">
        <div class="container">
            <div class="title has-text-centered white-title">
                Tickets
                <a @click="showModalTicketCreation = true" class="super-button">+</a>
            </div>
            <div class="buttons has-addons is-centered">
                <span class="button" :class="index === 0 ? 'is-info' : ''" @click="index = 0">Ouverts</span>
                <span class="button" :class="index === 1 ? 'is-info' : ''" @click="index = 1">Tous</span>
                <span class="button" :class="index === 2 ? 'is-info' : ''" @click="index = 2">Fermés</span>
            </div>
            <br>
                <div class="tile is-ancestor">
                    <div class="tile is-vertical">
                    <div v-for="ticket in showTickets" :key="ticket._id"
                        class="tile is-child background-tile" style="border-radius: 3px; padding: 10px 0">
                        <a @click="idToModal(ticket)" style="color: #4a4a4a">
                            <div class="columns is-centered">
                                <div class="column is-mobile">
                                    <div id="ticket-status" class="has-text-centered icon-status">
                                        <i v-if="ticket.status === 'open'" class="fas fa-bell fa-3x"></i>
                                        <i v-else-if="ticket.status === 'closed'" class="fas fa-lock fa-3x"></i>
                                    </div>
                                </div>
                                <div class="column is-one-third is-mobile">
                                    <div id="ticket-title" class="has-text-left title-section">
                                        <p class="bold modimo-color modimo-size"> {{ ticket.title }} </p>
                                        <p class="bold">Créé par : </p> {{ticket.author_id}}
                                    </div>
                                </div>
                                <div class="column is-one-quarter is-mobile">
                                    <div id="ticket-time" class="has-text-left">
                                            <p class="bold">Créé le : </p>
                                            <time :datetime="ticket.created_at">{{ dateFormater(ticket.created_at) }}</time> <br>
                                            <p class="bold">Derniere modification : </p>
                                            <time :datetime="ticket.updated_at">{{ dateFormater(ticket.updated_at) }}</time>
                                    </div>
                                </div>
                                <div class="column is-one-third is-mobile">
                                    <div id="ticket-advancement" class="has-text-left">
                                        <p class="bold">Avancement :</p>
                                        <div v-if="ticket.status === 'open'" class="animated-advancement">
                                            <p class="circle-processUp">Ouvert</p>
                                        </div>
                                        <div v-else-if="ticket.status === 'closed'" class="animated-advancement">
                                            <p class="circle-processDown">Fermé</p>
                                        </div>
                                    </div>
                                    <div id="ticket-vote" class="has-text-left">
                                        <p class="bold">vote :</p>
                                        <i class="far fa-thumbs-up"></i> {{ ticket.votes.length}}
                                    </div>
                                </div>
                            </div>
                        </a>
                        <ticket :ticket="currentTicket" v-show="showModalTicket" @close_modal="showModalTicket = false"></ticket>
                    </div>
                </div>
            </div>
            <ticketCreation v-show="showModalTicketCreation" @close_modal="closeModalTicketCreation"></ticketCreation>
        </div>
    </section>
</template>

<script>
import moment from 'moment'
import ticket from './Ticket.vue'
import ticketCreation from './TicketCreation.vue'
import TicketService from '@/services/TicketService'

export default {
    name: 'Ticket',
    data () {
        return {
            //  Maybe not the type but data?
            tickets: [],
            showTickets: [],
            showModalTicket: false,
            showModalTicketCreation: false,
            author_id: '',
            title: '',
            content: '',
            votes: [],
            comments: '',
            created_at: null,
            updated_at: null,
            status: '',
            residence_id: '',
            currentTicket: undefined,
            index: 1
            //  not the type, empty data
        }
    },
    mounted: function () {
        this.load() //  plusieurs fonctions appelées-> composant monté load la data
    },

    watch: {
        index: function(newIndex) {
            this.showTickets = this.sortTickets(newIndex);
        }
    },
    methods: {
        closeModalTicketCreation: function(ticket) {
            if (ticket) {
                this.tickets.push(ticket);
                this.$parent.notification = {type: 'success', message: 'Ticket créé avec succès !'}
            }
            this.showModalTicketCreation = false;
        },
        async load () {
            // console.log(this.$parent)
            this.current_user = await this.$parent.getCurrentUser()
            const resp = await TicketService.getTickets(this.$cookies.get('api_token'), this.current_user.residence._id)
            if (resp.data.success) {
                this.tickets = resp.data.tickets
                this.showTickets = this.sortTickets(this.index)
            } else {
                this.$parent.notification = {type: 'failure', message: 'Erreur lors de la récupération des tickets'}
            }
        },
        sortTickets: function(index) {
            let tickets = this.tickets.sort((a, b) => {
                if ((a.status === b.status && a.votes.length > b.votes.length) ||
                    (a.status !== b.status && a.status === 'open'))
                    return -1;
                else if ((a.status === b.status && a.votes.length < b.votes.length) ||
                         (a.status !== b.status && a.status === 'closed'))
                    return 1;
                return 0;
            })
            return tickets.filter(ticket => {
                if (index === 0) return ticket.status === 'open'
                else if (index === 2) return ticket.status === 'closed'
                else return true
            })
        },
        idToModal: function (ticket) {
            this.currentTicket = ticket
            this.showModalTicket = true
        },

        dateFormater(unFormatedDate) {
            var date = moment(String(unFormatedDate)).format('MM/DD/YYYY hh:mm')
            return (date)
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
