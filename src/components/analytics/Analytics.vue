<template>
    <section class="hero is-info is-fullheight">
    <nav></nav>
        
        <div class="section container">
            <div class="tile is-ancestor notification">
                
                <div class="tile is-vertical">

                    <div class="tile">
                        <div class="tile is-vertical is-parent">
                            <article class="tile is-child notification is-info">
                                <p class="title">Select date range:</p>
                                <div class="content">
                                    <date-picker v-model="daterange" lang='fr' range :shortcuts="shortcuts"></date-picker>
                                </div>
                            </article>
                        </div>

                        <div class="tile is-vertical is-parent">
                            <article class="tile is-child notification">
                            <p class="title is-1 has-text-grey-dark">{{current_user.residence.name}}</p>
                            </article>
                        </div>
                    </div>



                    <div class="tile">
                        <div class="tile is-vertical is-parent">
                            <article class="tile is-child notification is-info">
                            <p class="title">{{n_tickets_open}}</p>
                            <p class="subtitle">Tickets open</p>
                            </article>
                        </div>
                        <div class="tile is-vertical is-parent">
                            <article class="tile is-child notification is-info">
                            <p class="title">{{n_tickets_pending}}</p>
                            <p class="subtitle">Tickets pending</p>
                            </article>
                        </div>
                        <div class="tile is-vertical is-parent">
                            <article class="tile is-child notification is-info">
                            <p class="title">{{n_tickets_closed}}</p>
                            <p class="subtitle">Tickets closed</p>
                            </article>
                        </div>
                    </div>


                    
                    <div class="tile">
                    <div class="tile is-parent is-vertical">
                        <article class="tile is-child notification is-info">
                        <p class="title">Tickets created by date</p>
                        <figure class="image">
                            <area-chart :data="tickets_created_per_day" :library="{animation: { easing: 'easeOutQuad' }}"></area-chart>
                        </figure>
                        </article>
                        <article class="tile is-child notification is-info">
                        <p class="title">Pretty impressive!</p>
                        </article>
                    </div>
                    <div class="tile is-parent">
                        <article class="tile is-child notification is-info">
                        <p class="title">Gardi performance</p>
                        <p class="subtitle">This chart shows who closed the most tickets</p>
                        <figure class="image">
                            <pie-chart :messages="{empty: 'Pas de tickets fermés a ce jour'}" :data="chart_tickets" :library="{animation: { easing: 'easeOutQuad' }}"></pie-chart>
                        </figure>
                        </article>
                    </div>
                    </div>
                    <div class="tile">
                    <div class="tile is-vertical is-parent">
                        <article class="tile is-child notification is-info">
                        <p class="title">Shortest ticket</p>
                        <p class="subtitle">{{shortest_ticket.title}}</p>
                        <div class="content">
                        Resolved in just: {{shortest_ticket_time}}
                        </div>
                        </article>
                    </div>
                    <div class="tile is-vertical is-parent">
                        <article class="tile is-child notification is-info">
                        <p class="title">{{avg_ticket_time}}</p>
                        <p class="subtitle">Average ticket resolution time</p>
                        </article>
                    </div>
                    <div class="tile is-vertical is-parent">
                        <article class="tile is-child notification is-info">
                        <p class="title">Longest ticket</p>
                        <p class="subtitle">{{longest_ticket.title}}</p>
                        <div class="content">
                        Resolved after: {{longest_ticket_time}}
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
                    text: 'Today',
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
    mounted: function () {
        this.load()
    },
    methods: {
        async load () {
            this.current_user = await this.$parent.getCurrentUser()
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

</style>
