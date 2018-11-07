<style lang="scss">
@import './scss/Tickets.scss';
@import '../../styles/global.scss';
</style>

<template>
<!--Give_UserIdto Component-->
    <section class="hero is-fullheight-minus-navbar modimo-dark">
        <div class="hero-body">
            <div class="container">
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
                                    <div class="column is-2-mobile is-1-desktop">
                                        <div id="ticket-status" class="icon-status has-text-centered">
                                            <i v-if="ticket.status === 'open'" class="fas fa-bell fa-2x"></i>
                                            <i v-else-if="ticket.status === 'closed'" class="fas fa-lock fa-2x"></i>
                                        </div>
                                    </div>
                                    <div class="column is-11-mobile is-6-desktop">
                                        <p class="bold modimo-color modimo-title-size is-text-overflow has-text-centered"> {{ ticket.title }} </p>
                                    </div>
                                    <div class="column is-6-mobile is-3-desktop">
                                        <p class="bold modimo-content-size is-text-overflow has-text-right">Créé le <time :datetime="ticket.created_at" class="no-bold">{{ dateFormater(ticket.created_at) }}</time></p>
                                        <p class="bold modimo-content-size is-text-overflow has-text-right"><span v-if="ticket.author_name!=''" >par </span><span class="no-bold">{{ticket.author_name}}</span></p>
                                    </div>
                                    <div class="column is-3-mobile is-2-desktop has-text-right">
                                        <span v-if="ticket.status === 'open'" class="bold circle-processUp">Ouvert</span>
                                        <span v-else-if="ticket.status === 'closed'" class="bold circle-processDown">Fermé</span>
                                        <p class="bold"><i class="far fa-thumbs-up"/> {{ ticket.votes.length}}</p>
                                    </div>
                                </div>
                            </a>
                            <ticket :ticket="currentTicket"  :current_user="current_user"  v-show="showModalTicket" @close_modal="showModalTicket = false"></ticket>
                        </div>
                    </div>
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
            //  Maybe not the type but data?
            currentTicket: '',
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
            //  not the type, empty data
        }
    },
    watch: {
        index: function(newIndex) {
            this.showTickets = this.sortTickets(newIndex);
        },
        sortIndex: function(newIndex) {
            this.showTickets = this.sortTickets(newIndex);
        },
        '$parent.currentUser' : function(newCurrentUser) {
            this.current_user = newCurrentUser
            this.load();
        }
    },
    methods: {
        async load () {
            const resp = await TicketService.getTickets(this.$cookies.get('api_token'), this.current_user.residence._id)
            if (resp.data.success) {
                this.tickets = resp.data.tickets
                this.get_tickets_authors_and_comments()
                this.showTickets = this.sortTickets(this.index)
            } else {
                this.$parent.notification = {type: 'failure', message: 'Erreur lors de la récupération des tickets'}
            }
        },
        async get_tickets_authors_and_comments () {
                //console.log(this.$parent)
            // let n = 0;
            this.tickets.forEach(async (ticket, n) => {
                const resp = await UserService.getUser(this.$cookies.get('api_token'), ticket.author_id)
                if (resp.data.success) {
                    ticket.author_name = resp.data.user.name;
                } else {
                    // Vue.set(this.tickets, n, ticket.author_id)
                    ticket.author_name = ticket.author_id
                    this.$parent.notification = {type: 'failure', message: 'Erreur lors de la récuperation du nom de l\'auteur du ticket'}
                }
                const resp2 = await CommentsService.getComments(this.$cookies.get('api_token'), ticket._id)
                if (resp2.data.success) {
                    ticket.comments = resp2.data.comments;
                } else {
                    this.$parent.notification = {type: 'failure', message: 'Erreur lors de la récuperation du nom de l\'auteur du commentaire'}
                }

                ticket.comments.forEach(async (comment) => {
                    const resp = await UserService.getUser(this.$cookies.get('api_token'), comment.author_id)
                    if (resp.data.success) {
                        comment.author_name = resp.data.user.name;
                    } else {
                        this.$parent.notification = {type: 'failure', message: 'Erreur lors de la récuperation du nom de l\'auteur du commentaire'}
                    }
                })
                n = n + 1;
            })
            vm.$forceUpdate();
        },
        closeModalTicketCreation: function(ticket) {
            if (ticket) {
                this.tickets.push(ticket);
                this.showTickets = this.sortTickets(this.index);
                this.$parent.notification = {type: 'success', message: 'Ticket créé avec succès !'}
            }
            this.showModalTicketCreation = false;
        },

        sortTickets: function(index) {
            let tickets = this.tickets.sort((a, b) => {
                if ((a.status === b.status && ((this.sortIndex === 0 && a.votes.length > b.votes.length) || (this.sortIndex === 1 && a.created_at > b.created_at))) ||
                    (a.status !== b.status && a.status === 'open'))
                    return -1;
                else if ((a.status === b.status && ((this.sortIndex === 0 && a.votes.length < b.votes.length) || (this.sortIndex === 1 && a.created_at < b.created_at))) ||
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
