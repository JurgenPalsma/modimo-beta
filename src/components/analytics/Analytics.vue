<template>
    <section class="hero modimo-dark is-fullheight">
    <nav></nav>
        
        <div class="section container" style="background-color: #2b5bb2">
            <div class="tile is-ancestor notification modimo-dark">
                
                <div class="tile is-vertical">

                    <div class="tile">
                        <div class="tile is-vertical is-parent">
                            <article class="tile is-child notification is-white">
                                <p class="title">Sélectionnez la plage de dates:</p>
                                <div class="content">
                                    <date-picker v-model="daterange" lang='fr' range :shortcuts="shortcuts"></date-picker>
                                </div>
                            </article>
                        </div>

                        <div class="tile is-vertical is-parent">
                            <article class="tile is-child notification is-white">
                            <p class="title is-1">{{current_user.residence.name}}</p>
                            </article>
                        </div>
                    </div>



                    <div class="tile">
                        <div class="tile is-vertical is-parent">
                            <article class="tile is-child notification is-white">
                            <p class="title modimo-title">{{n_tickets_open}}</p>
                            <p class="subtitle">Tickets ouverts</p>
                            </article>
                        </div>
                        <div class="tile is-vertical is-parent">
                            <article class="tile is-child notification is-white">
                            <p class="title modimo-title">{{n_tickets_pending}}</p>
                            <p class="subtitle">Tickets en attente</p>
                            </article>
                        </div>
                        <div class="tile is-vertical is-parent">
                            <article class="tile is-child notification is-white">
                            <p class="title modimo-title">{{n_tickets_closed}}</p>
                            <p class="subtitle">Tickets fermés</p>
                            </article>
                        </div>
                    </div>


                    
                    <div class="tile">
                    <div class="tile is-parent is-vertical">
                        <article class="tile is-child notification is-white">
                        <p class="title">Tickets créés par date</p>
                        <figure class="image">
                            <area-chart :data="tickets_created_per_day" :library="{animation: { easing: 'easeOutQuad' }}"></area-chart>
                        </figure>
                        </article>
                        <article class="tile is-child notification is-white">
                        <p class="title">Statistiques</p>
                        </article>
                    </div>
                    <div class="tile is-parent">
                        <article class="tile is-child notification is-white">
                        <p class="title">Performances du Gardien</p>
                        <p class="subtitle">Cette charte montre qui a fermé le plus de ticket</p>
                        <figure class="image">
                            <pie-chart :messages="{empty: 'Pas de tickets fermés a ce jour'}" :data="chart_tickets" :library="{animation: { easing: 'easeOutQuad' }}"></pie-chart>
                        </figure>
                        </article>
                    </div>
                    </div>
                    <div class="tile" v-if="shortest_ticket && longest_ticket">
                        <div class="tile is-vertical is-parent">
                            <article class="tile is-child notification is-white">
                            <p class="title">Ticket le plus rapide</p>
                            <p class="subtitle">{{shortest_ticket.title}}</p>
                            <div class="content modimo-title">
                            Résolu en seulement: {{shortest_ticket_time}}
                            </div>
                            </article>
                        </div>
                        <div class="tile is-vertical is-parent">
                            <article class="tile is-child notification is-white">
                            <p class="title modimo-title">{{avg_ticket_time}}</p>
                            <p class="subtitle">Temps de résolution moyen par ticket</p>
                            </article>
                        </div>
                        <div class="tile is-vertical is-parent">
                            <article class="tile is-child notification is-white">
                            <p class="title">Ticket le plus lent</p>
                            <p class="subtitle">{{longest_ticket.title}}</p>
                            <div class="content modimo-title">
                            Résolu après: {{longest_ticket_time}}
                            </div>
                            </article>
                        </div>
                    </div>

                </div>
            
            </div>   
        </div>    
    </section>
</template>

<script>

import AnalyticsService from '@/services/AnalyticsService'
import DatePicker from 'vue2-datepicker'

export default {
    name: 'Analytics',

    data () {
        return {
            /* Stats data */
            n_tickets_open: 0,
            n_tickets_pending: 0,
            n_tickets_closed: 0,
            chart_tickets: [],
            tickets_created_per_day: [],
            avg_ticket_time: 0,
            shortest_ticket: {_id: null, title: null},
            shortest_ticket_time: null,
            longest_ticket: {_id: null, title: null},
            longest_ticket_time: null,

            /* DatePicker */
            daterange: [],
            from: '',
            to: '',
            shortcuts: [
                {
                    text: `Aujourd'hui`,
                    onClick: () => {
                        this.daterange = [ new Date(), new Date() ]
                    }
                }
            ],
            timePickerOptions: {
                start: '00:00',
                step: '00:30',
                end: '23:30'
            },
            current_user: {
                residence: ''
            }
        }
    },
    created: function () {
        this.load()
    },
    methods: {
        async load () {
            this.current_user =  this.$parent.currentUser
            const resp = await AnalyticsService.getStats(this.$cookies.get('api_token'), this.daterange)
            if (resp.data.success) {
                this.n_tickets_open = resp.data.ticket_numbers.tickets_open
                this.n_tickets_pending = resp.data.ticket_numbers.tickets_pending
                this.n_tickets_closed = resp.data.ticket_numbers.tickets_closed
                this.chart_tickets = resp.data.chart_tickets
                this.tickets_created_per_day = resp.data.tickets_created_per_day
                this.avg_ticket_time = resp.data.ticket_times.avg_ticket_time
                this.shortest_ticket = resp.data.ticket_times.shortest_ticket
                this.shortest_ticket_time = resp.data.ticket_times.shortest_ticket_time
                this.longest_ticket = resp.data.ticket_times.longest_ticket
                this.longest_ticket_time = resp.data.ticket_times.longest_ticket_time
            } else {
                this.$parent.notification = {type: 'failure', message: 'Erreur lors du chargement des données'}
            }
        }
    },
    watch: {
        daterange: function (val) {
            this.load()
        }
    },
    components: {
        DatePicker
    }
}
</script>

<style lang="scss">
@import '../../styles/global.scss';
</style>
