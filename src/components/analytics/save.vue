<template>
    <section class="hero is-info  is-fullheight">
        <div class="section container">
            <div class="section">
                <h1 class="title">
                    Analytics
                </h1>
            </div>
            <date-picker v-model="daterange" lang='fr' range :shortcuts="shortcuts"></date-picker>
            <div class="level">
                <div class="level-item has-text-centered">
                    <div>
                    <p class="heading">Open tickets</p>
                    <p class="title">{{n_tickets_open}}</p>
                    </div>
                </div>
                <div class="level-item has-text-centered">
                    <div>
                    <p class="heading">Tickets pending</p>
                    <p class="title">{{n_tickets_pending}}</p>
                    </div>
                </div>
                <div class="level-item has-text-centered">
                    <div>
                    <p class="heading">Tickets closed</p>
                    <p class="title">{{n_tickets_closed}}</p>
                    </div>
                </div> 
            </div>
            <div class="tile is-parent">
                <article class="tile is-child notification is-info">
                    <p class="title">Middle tile</p>
                    <p class="subtitle">With an image</p>
                    <figure class="image">
                        <pie-chart :messages="{empty: 'Pas de tickets fermés a ce jour'}" :data="chart_tickets" :library="{animation: { easing: 'easeOutQuad' }}"></pie-chart>
                    </figure>
                </article>
            </div>
            <div class="level">
                <div class="level-item is-child notification tile"> 
                    <div>                 
                        <pie-chart :messages="{empty: 'Pas de tickets fermés a ce jour'}" :data="chart_tickets" :library="{animation: { easing: 'easeOutQuad' }}"></pie-chart>
                        <p class="title">Tickets closed by caretaker</p>
                    </div>
                </div>

                <div class="level-item is-child notification tile">
                    <div>                 
                        <area-chart :data="tickets_created_per_day" :library="{animation: { easing: 'easeOutQuad' }}"></area-chart>
                        <p class="title">Tickets created per day</p>
                    </div>
                </div>
            </div>
            
            
            <!-- TODO: Set router link to ticket -->
            <div class="level">
                    <div class="level-item has-text-centered">      
                        <div>
                            <p class="heading">Shortest ticket</p>
                            <p class="title">{{shortest_ticket_time}}</p>
                            {{shortest_ticket.title}}
                        </div>
                    </div>
                <!-- TODO: Set router link to ticket -->
                    <div class="level-item has-text-centered">      
                        <div>
                            <p class="heading">Average resolution time</p>
                            <p class="title">{{avg_ticket_time}}</p>
                        </div>
                    </div>
                <!-- TODO: Set router link to ticket -->
                    <div class="level-item has-text-centered">      
                        <div>
                            <p class="heading">Longest Ticket</p>
                            <p class="title">{{longest_ticket_time}}</p>
                            {{longest_ticket.title}}
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
            }
        }
    },
    mounted: function () {
        this.load()
    },
    methods: {
        async load () {
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
