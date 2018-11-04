<template>
    <section>
        <div class="modal is-active">
            <div class="my-modal-background modal-background" style="opacity:50%;" @click="$emit('close_modal')"></div>
            <div class="modal-content">
                <div v-if="ticket" class="box">
                    <button class="delete is-pulled-right" aria-label="close" @click="$emit('close_modal')"></button>
                    <div class="media-content">
                        <div class="content">
                            <strong class="modimo-color modimo-size">{{ticket.author_name}} - {{ticket.title}}</strong>
                            <br>
                            <br>
                            <span ref="display_ticket">{{ticket.content}} {{ticket._id}}</span>
                            <!--ICI LE CHAMP QUI APPARAIT POUR LA MODIF DU MESSAGE-->
                            <div ref="space_modif_ticket" class="media-content" v-bind:style="{display: 'none'}">
                                <div class="field">
                                    <p class="control">
                                        <textarea ref="text_modif_ticket" v-bind:value="ticket.content" class="textarea" rows="2"></textarea>
                                    </p>
                                </div>
                                <div class="field">
                                    <p class="control is-pulled-right">
                                        <button class="button" v-on:click="cancelModifTicket">Annuler</button>&nbsp;
                                        <button class="button">Modifier</button>
                                    </p>
                                </div>
                            </div>
                            <br>
                            <small class="small-text">
                                <span v-if="ticket.updated_at === ticket.created_at">Créé le </span>
                                <span v-else>Modifié le </span>
                                {{dateFormater(ticket.updated_at)}}
                                <span v-if="this.current_user._id == this.ticket._id"> · <a ref="modif_ticket_button" v-on:click="modifTicket">Modifier le ticket</a></span>
                            </small>
                        </div>
                        <article class="media">
                            <div class="media-content comment">
                                <div v-for="comment in ticket.comments" :key="comment._id" >
                                    <article class="media">
                                    <p>
                                        <strong class="modimo-color">{{comment.author_name}}&nbsp;</strong>
                                        {{comment.content}}
                                        <br>
                                        <small class="small-text">
                                            <span v-if="comment.updated_at.$date === comment.created_at.$date">Créé le </span>
                                            <span v-else>Modifié le </span>{{dateFormater(comment.updated_at)}}
                                        </small>
                                    </p>
                                    </article>
                                </div>
                            </div>
                        </article>
                    </div>
                    <!--</article>-->
                    <article class="media">
                        <div class="media-content">
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
        // name: 'ticket',
        props: ['ticket', 'current_user'],
        data () {
            return {
                text_comment: '',
                //current_user: null,
                isNone: 'none;',
                isActive: true
            }
        },
        watch: {
        },
        methods: {
            closeTicket: async function (event) {
                const resp = await TicketService.closeTicket(this.$cookies.get('api_token'), this.ticket._id, 'closed')
            },
            commentTicket: async function (event) {
                var date = new Date()
                this.ticket.comments.push({
                    'author_name' : this.current_user.name,
                    'content': this.text_comment,
                    'created_at': {
                        '$date': date
                    },
                    'updated_at': {
                        '$date': date
                    }
                })
                const resp = await CommentService.postComment(this.$cookies.get('api_token'), this.ticket._id, 'ticket', this.text_comment)
                this.text_comment = ''
                if (resp.data.success) {
                    console.log('successss')
                }
                else {
                    console.log(resp.data.message)
                }
            },
            commentAndClose: async function (event) {
                commentTicket()
                closeTicket()
            },
            modifTicket: function (event) {
                this.$refs.space_modif_ticket.style = 'display: block;'
                this.$refs.display_ticket.style = 'display: none;'
                this.$refs.modif_ticket_button.style = 'display: none;'
            },
            cancelModifTicket: function (event) {
                this.$refs.space_modif_ticket.style = 'display: none;'
                this.$refs.display_ticket.style = 'display: block;'
                this.$refs.modif_ticket_button.style = 'display: inline;'
            },
            dateFormater(unFormatedDate) {
            var date = moment(String(unFormatedDate)).format('MM/DD/YYYY hh:mm')
            return (date)
            }
        },
    }
</script>
<style lang="scss">       
</style>
