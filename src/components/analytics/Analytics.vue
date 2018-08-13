<template>
    <section class="hero is-info  is-fullheight">
        <div class="section container">
            <div class="section">
                <h1 class="title">
                    Analytics
                </h1>
            </div>

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

            <div> 
                <pie-chart :messages="{empty: 'Pas de tickets fermés a ce jour'}" :data="chart_tickets" :library="{animation: { easing: 'easeOutQuad' }}"></pie-chart>
            </div>

            
        </div>
    
    </section>
</template>

<script>

import AnalyticsService from '@/services/AnalyticsService'

export default {
    name: 'Analytics',

    data () {
        return {
            n_tickets_open: 0,
            n_tickets_pending: 0,
            n_tickets_closed: 0,
            daterange: [],
            chart_tickets: []
        }
    },
    mounted: function () {
        this.load()
    },
    methods: {
        async load () {
            const resp = await AnalyticsService.getStats(this.$cookies.get('api_token'), this.daterange)
            if (resp.data.success) {
                console.log(resp.data)
                this.n_tickets_open = resp.data.ticket_numbers.tickets_open
                this.n_tickets_pending = resp.data.ticket_numbers.tickets_pending
                this.n_tickets_closed = resp.data.ticket_numbers.tickets_closed
                this.chart_tickets = resp.data.chart_tickets
            }
        }
    }
}
</script>

<style lang="scss">

</style>
