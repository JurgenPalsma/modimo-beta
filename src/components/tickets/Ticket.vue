<template>
    <section class="container">
        <div class="card">
            <header class="card-header">
                <p class="card-header-title">
                Ticket title
                </p>
                <a @click="toggle" class="card-header-icon" >
                <span v-if="!toggled" class="icon" > <i class="fas fa-angle-left" ></i></span>
                <span v-else-if="toggled" class="icon" > <i class="fas fa-angle-up" ></i></span>
                </a>
            </header>
            <div v-if="toggled" class="card-content">
                <div> Author </div>
                <div> 12/01/10 </div>
                <div class="content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
                <br>
                <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                </div>
            </div>
            <footer class="card-footer">
                <a href="#" class="card-footer-item">Save</a>
                <a href="#" class="card-footer-item">Edit</a>
                <a href="#" class="card-footer-item">Delete</a>
            </footer>
        </div>
   </section>
</template>

<script>

import TicketService from '@/services/TicketService'

export default {
    name: 'Ticket',

    data () {
        return {
            //Maybe not the type but data?
          author_id: "",
          title: "",
          content: "",
          votes: "",
          comments: "",
          created_at: null,
          updated_at: null,
          status: "",
          residence_id: "",
          //not the type, empty data
        }
    },
    mounted: function () {
        this.load() //plusieurs fonctions appelées-> composant monté load la data
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
        }
    },

}

/* OLD

export default {
    name: 'home',
    data () {
        return {
            toggled: false
        }
    },
    methods: {
        toggle: function () {
            this.toggled = !this.toggled
        }
    }
}
*/
</script>

<style lang="scss">

</style>
