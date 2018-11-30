<style lang="scss">
@import './scss/Tickets.scss';
@import '../../styles/global.scss';
</style>

<template>
    <section class="hero is-fullheight modimo-dark">
        <div class="hero-body" style="display: block;">
            <div class="container">
                <br/>
                <div class="title has-text-centered white-title">
                    Tickets
                    <a @click="showModalTicketCreation = true" class="super-button">+</a>
                </div>
                <div class="columns">
                    <div class="column is-12-mobile is-4-tablet is-offset-4-tablet">
                        <div class="buttons has-addons is-centered">
                            <span class="button" style="width: 33.3%" :class="index === 0 ? 'is-info' : ''" @click="index = 0">Ouverts</span>
                            <span class="button" style="width: 33.4%" :class="index === 1 ? 'is-info' : ''" @click="index = 1">Tous</span>
                            <span class="button" style="width: 33.3%" :class="index === 2 ? 'is-info' : ''" @click="index = 2">Fermés</span>
                        </div>
                    </div>
                    <div class="column is-12-mobile is-3-tablet is-offset-1-tablet">
                        <div class="dropdown" :class="dropdownVisible ? 'is-active' : ''" @click="dropdownVisible = !dropdownVisible">
                            <div class="dropdown-trigger">
                                <button class="button is-fullwidth" aria-haspopup="true" aria-controls="dropdown-menu">
                                <span>{{this.sortBy[this.sortIndex]}}</span>
                                <span class="icon is-small">
                                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                                </span>
                                </button>
                            </div>
                            <div class="dropdown-menu" id="dropdown-menu" role="menu">
                                <div class="dropdown-content">
                                    <a v-for="(sort, index) in sortBy" :key="sort" @click="sortIndex = index" class="dropdown-item" :class="index === sortIndex ? 'is-active' : ''">
                                        {{sort}}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <div class="columns is-multiline">
                    <div v-for="ticket in showTickets" :key="ticket._id" class="column modimo-tiny-padding is-12">
                        <div class="modimo-tile">
                            <a @click="idToModal(ticket)" style="color: #4a4a4a">
                                <div class="columns is-vcentered is-mobile is-multiline" style="margin:0">
                                    <div class="column is-hidden-mobile is-1 has-text-centered">
                                        <span v-if="ticket.status === 'open'" class="bold circle-processUp">Ouvert</span>
                                        <span v-else-if="ticket.status === 'closed'" class="bold circle-processDown">Fermé</span>
                                    </div>
                                    <div class="column is-11-mobile is-9-desktop">
                                        <p class="bold modimo-color modimo-title-size is-text-overflow has-text-centered-mobile"> {{ ticket.title }} </p>
                                        <p class="has-text-centered-mobile"> {{ticket.comments.length}} commentaire<span v-if="ticket.comments.length > 1">s</span> · &nbsp;&nbsp;<i class="far fa-thumbs-up"/> {{ticket.votes.length}}</p>
                                    </div>
                                    <div class="column is-6-mobile is-2-desktop">
                                        <p class="bold modimo-content-size is-text-overflow has-text-right"><time :datetime="ticket.updated_at" class="no-bold">{{ dateFormater(ticket.last_update_at) }}</time></p>
                                        <p class="bold modimo-content-size is-text-overflow has-text-right">{{ticket.author_name}}</p>
                                    </div>
                                    <div class="column is-hidden-desktop is-hidden-tablet is-3-mobile has-text-right">
                                        <span v-if="ticket.status === 'open'" class="bold circle-processUp">Ouvert</span>
                                        <span v-else-if="ticket.status === 'closed'" class="bold circle-processDown">Fermé</span>
                                    </div>

                                </div>
                            </a>
                        </div>
                    </div>
                    <ticket :ticket="currentTicket"  :current_user="current_user"  v-show="showModalTicket" @close_modal="showModalTicket = false"></ticket>
                </div>
                <ticketCreation v-show="showModalTicketCreation" @close_modal="closeModalTicketCreation"></ticketCreation>
            </div>
        </div>
    </section>
</template>

<script>
import moment from 'moment'
import ticket from './Ticket.vue'
import ticketCreation from './TicketCreation.vue'
import TicketService from '@/services/TicketService'
import CommentsService from '@/services/CommentService'
import UserService from '@/services/UserService'


export default {
    name: 'Ticket',
    data () {
        return {
            current_user: '',
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
            index: 1,
            dropdownVisible: false,
            sortBy: ['Le plus important', 'Le plus récent'],
            sortIndex: 0
        }
    },
    created () {
        this.load()
    },
    watch: {
        index: function(newIndex) {
            this.showTickets = this.sortTickets();
        },
        sortIndex: function(newIndex) {
            this.showTickets = this.sortTickets();
        }
    },
    methods: {
        loadDates (ticket) {
            let date = ticket.updated_at
            ticket.comments.forEach(function (comment) {
                if (date < comment.created_at) {
                    date = comment.created_at
                }
            })
            ticket.last_update_at = date
        },
        async loadTickets () {
            console.log('loadtickets')
            const resp = await TicketService.getTickets(this.$cookies.get('api_token'), this.current_user.residence._id)
            if (resp.data.success) {
                this.tickets = resp.data.tickets
                await this.get_tickets_authors_and_comments()
            } else {
                console.log('Erreur lors de la récupération des tickets')
            }
        },
        async load() {
            await this.$parent.getCurrentUser();
            this.current_user =  this.$parent.currentUser;
            this.loadTickets()
        },
        async get_tickets_authors_and_comments () {
            for (let n = 0; n < this.tickets.length; n++) {
                const resp = await UserService.getUser(this.$cookies.get('api_token'), this.tickets[n].author_id)
                if (resp.data.success) {
                    this.tickets[n].author_name = resp.data.user.name;
                } else {
                    this.tickets[n].author_name = 'Anonyme'
                }
                const resp2 = await CommentsService.getComments(this.$cookies.get('api_token'), this.tickets[n]._id)
                if (resp2.data.success) {
                    this.tickets[n].comments = resp2.data.comments;
                    this.loadDates(this.tickets[n])
                } else {
                    console.warn('Erreur lors de la récuperation des commentaires')
                }
                this.tickets[n].comments.forEach(async (comment) => {
                    const resp = await UserService.getUser(this.$cookies.get('api_token'), comment.author_id)
                    if (resp.data.success) {
                        comment.author_name = resp.data.user.name;
                    } else {
                        console.log('Erreur lors de la récuperation du nom de l\'auteur du commentaire')
                    }
                })
            }
            this.showTickets = this.sortTickets()
        },
        closeModalTicketCreation: function(ticket) {
            if (ticket) {
                this.loadTickets()
                //console.log(ticket)
                //this.loadDates(ticket)
                //ticket.author_name = this.current_user.name
                //this.tickets.push(ticket);
                //this.showTickets = this.sortTickets();
                this.$parent.notification = {type: 'success', message: 'Ticket créé avec succès !'}
            }
            this.showModalTicketCreation = false;
        },

        sortTickets: function() {
            let tickets = this.tickets.sort((a, b) => {
                if (a.status === b.status && ((a.last_update_at > b.last_update_at && this.sortIndex === 1) || (this.sortIndex === 0 && (a.votes.length > b.votes.length || (a.votes.length == b.votes.length && a.last_update_at > b.last_update_at)))) || (a.status !== b.status && a.status === 'open'))
                    return -1;
                else if ((a.status === b.status && (a.last_update_at < b.last_update_at && this.sortIndex === 1) || (this.sortIndex === 0 && a.votes.length < b.votes.length)) || (a.status !== b.status && a.status === 'closed'))
                    return 1;
                return 0;
            })
            return tickets.filter(ticket => {
                if (this.index === 0) return ticket.status === 'open'
                else if (this.index === 2) return ticket.status === 'closed'
                else return true
            })
        },
        idToModal: function (ticket) {
            this.currentTicket = ticket
            this.showModalTicket = true
        },

        dateFormater(unFormatedDate) {
            var date = moment(String(unFormatedDate)).format('MM/DD/YY à hh:mm')
            return (date)
        }
    },
    components: {
        'ticket': ticket,
        'ticketCreation': ticketCreation
    }
}
</script>
