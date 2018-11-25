<template>
    <section>
        <div class="modal is-active">
            <div class="my-modal-background modal-background" v-on:click="closeModal"></div>
            <div class="modal-content">
                <div v-if="ticket" class="box">
                    <button class="delete is-pulled-right" aria-label="close" v-on:click="closeModal"></button>
                    <div class="media-content">
                        <div class="content">
                            <strong class="modimo-color modimo-size">{{ticket.author_name}} - {{ticket.title}}</strong>
                            <br>
                            <br>
                            <span ref="display_ticket">{{ticket.content}}</span>
                            <div ref="space_modif_ticket" class="media-content" v-bind:style="{display: 'none'}">
                                <div class="field">
                                    <p class="control">
                                        <textarea ref="text_modif_ticket" v-bind:value="ticket.content" class="textarea" rows="2"></textarea>
                                    </p>
                                </div>
                                <div class="field">
                                    <p class="control is-pulled-right">
                                        <button class="button" v-on:click="cancelModifTicket">Annuler</button>&nbsp;
                                        <button class="button" v-on:click="modifTicket">Modifier</button>
                                    </p>
                                </div>
                            </div>
                            <br>
                            <small class="small-text">
                                <span v-if="ticket.updated_at === ticket.created_at">Créé le </span>
                                <span v-else>Modifié le </span>
                                {{dateFormater(ticket.updated_at)}}
                                <span v-if="this.current_user._id == this.ticket.author_id && this.ticket.status == 'open'"> · <a ref="modif_ticket_button" v-on:click="activeModifTicket">Modifier le ticket</a></span>
                                <br>
                                <a v-if="ticket.status == 'open' && ticket.author_id != current_user._id"><span v-on:click="likeTicket" v-if="ticket.votes.indexOf(current_user._id) == -1">Prioriser</span><span v-on:click="unlikeTicket" v-else>Ne plus prioriser</span> · </a><i class="far fa-thumbs-up"/> {{ticket.votes.length}}
                            </small>
                        </div>
                        <article class="media">
                            <div class="media-content comment">
                                <div v-for="comment in ticket.comments" :key="comment._id">
                                    <article class="media">
                                    <p>
                                        <strong class="modimo-color">{{comment.author_name}}&nbsp;</strong>
                                        {{comment.content}}
                                        <br>
                                        <small class="small-text">
                                            <span v-if="comment.updated_at === comment.created_at">Créé le </span>
                                            <span v-else>Modifié le </span>{{dateFormater(comment.updated_at)}}
                                        </small>
                                    </p>
                                    </article>
                                </div>
                            </div>
                        </article>
                    </div>
                    <article class="media">
                        <div v-if="ticket.status != 'closed'" class="media-content">
                            <div class="field">
                                <p class="control">
                                    <input v-model="text_comment" class="textarea" @keyup.enter="commentTicket" rows="1" placeholder="Écrit ton commentaire...">
                                </p>
                            </div>
                            <div class="field">
                                <p class="control is-pulled-right">
                                    <span v-if="current_user && current_user.roles.includes('CARETAKER')">
                                        <button class="button is-warning" @click="closeTicket">Clôturer</button>
                                        <button class="button is-warning" @click="commentAndClose">Envoyer et Clôturer</button>
                                    </span>
                                    <button ref="send_comment" class="button" @click="commentTicket">Envoyer</button>
                                </p>
                            </div>
                        </div>
                        <div v-else class="media-content">
                            <span class="bold circle-processDown is-pulled-right">Fermé</span>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import UserService from '@/services/UserService'
    import CommentService from '@/services/CommentService'
    import TicketService from '@/services/TicketService'
    import moment from 'moment'
    export default {
        props: ['ticket', 'current_user'],
        data () {
            return {
                text_comment: '',
                isNone: 'none;',
                isActive: true
            }
        },
        methods: {
            closeTicket: async function (event) {
                const resp = await TicketService.closeTicket(this.$cookies.get('api_token'), this.ticket._id, 'closed')
                if (resp.data.success) {
                    this.ticket.status = "closed"
                    this.closeModal()
                }
                else {
                    console.warn('CLOSE TICKET failed :', resp.data.message)
                }
            },
            likeTicket: async function (event) {
                const resp = await TicketService.likeTicket(this.$cookies.get('api_token'), this.ticket._id)
                if (resp.data.success) {
                    this.ticket.votes.push(this.current_user._id)
                }
                else {
                    console.warn('CLOSE TICKET failed :', resp.data.message)
                }
            },
            unlikeTicket: async function (event) {
                const resp = await TicketService.likeTicket(this.$cookies.get('api_token'), this.ticket._id)
                if (resp.data.success) {
                    this.ticket.votes.splice(this.current_user._id, 1)
                }
                else {
                    console.log('LIKE TICKET failed :')
                    console.log(resp.data.message)
                }
            },
            commentTicket: async function (event) {
                if (this.text_comment == "")
                    return
                var date = new Date();
                this.ticket.comments.push({
                    'author_name' : this.current_user.name,
                    'content': this.text_comment,
                    'created_at': date,
                    'updated_at': date
                })
                const resp = await CommentService.postComment(this.$cookies.get('api_token'), this.ticket._id, 'ticket', this.text_comment)
                this.text_comment = ''
                if (resp.data.success) {
                }
                else {
                    console.log(resp.data.message)
                }
            },
            commentAndClose: async function (event) {
                this.commentTicket()
                this.closeTicket()
            },
            activeModifTicket: function (event) {
                this.$refs.space_modif_ticket.style = 'display: block;'
                this.$refs.display_ticket.style = 'display: none;'
                this.$refs.modif_ticket_button.style = 'display: none;'
            },
            modifTicket: async function (event) {
                this.ticket.content = this.$refs.text_modif_ticket.value
                this.ticket.updated_at = new Date()
                const rest = await TicketService.updateTicket(this.$cookies.get('api_token'), this.ticket._id, this.$refs.text_modif_ticket.value)
                this.$refs.space_modif_ticket.style = 'display: none;'
                this.$refs.display_ticket.style = 'display: block;'
                this.$refs.modif_ticket_button.style = 'display: inline;'
            },
            cancelModifTicket: function (event) {
                this.$refs.space_modif_ticket.style = 'display: none;'
                this.$refs.display_ticket.style = 'display: block;'
                this.$refs.modif_ticket_button.style = 'display: inline;'
            },
            dateFormater(unFormatedDate) {
            var date = moment(String(unFormatedDate)).format('MM/DD/YYYY hh:mm')
            return (date)
            },
            closeModal() {
                this.$parent.loadTickets();
                if (this.$refs.modif_ticket_button) {
                    this.$refs.space_modif_ticket.style = 'display: none;'
                    this.$refs.display_ticket.style = 'display: block;'
                    this.$refs.modif_ticket_button.style = 'display: inline;'
                }
                this.$emit('close_modal')
            }
        },
    }
</script>
<style lang="scss">       
</style>
