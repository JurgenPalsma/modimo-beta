<template>
    <section>
        <div class="modal is-active">
            <div class="my-modal-background modal-background" style="opacity:50%;" @click="$emit('close_modal')"></div>
            <div class="modal-content">
                <div class="box">
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
                                            <span v-else>Modifié le </span>{{dateFormater(comment.updated_at.$date)}}
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
                                    <textarea v-model="text_comment" class="textarea" @keyup.enter="commentTicket" rows="1" placeholder="Écrit ton commentaire..."></textarea>
                                </p>
                            </div>
                            <div class="field">
                                <p class="control is-pulled-right">
                                    <span v-if="current_user && current_user.roles.includes('CARETAKER')">
                                        <button class="button is-warning">Clôturer</button>
                                        <button class="button is-warning">Envoyer et Clôturer</button>
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
                // ticket: {
                //     '_id': '123133',
                //     'title': 'Du feu dans la cheminée',
                //     'content': 'mon ascenseur est cassé, j\'ai envie d\'une pomme.',
                //     'author_id': '1238EeGZY3',
                //     'residence_id': '1e238aEeGZY3',
                //     'status': 'open',
                //     'created_at': {
                //         '$date': '2018-08-13T10:09:26.236Z'
                //     },
                //     'updated_at': {
                //         '$date': '2018-08-13T10:12:47.414Z'
                //     },
                //     'comments': [
                //         {
                //             '_id': '123133',
                //             'author_id': 'NadineDu6eme',
                //             'content': 'c\'est un vrai problème !',
                //             'created_at': {
                //                 '$date': '2018-08-14T10:09:26.236Z'
                //             },
                //             'updated_at': {
                //                 '$date': '2018-08-14T10:09:26.236Z'
                //             }
                //         },
                //         {
                //             '_id': '123134',
                //             'author_id': 'GastonRDC',
                //             'content': 'Je suis d\'accord.',
                //             'created_at': {
                //                 '$date': '2018-08-14T10:09:26.236Z'
                //             },
                //             'updated_at': {
                //                 '$date': '2018-08-14T10:12:47.414Z'
                //             }
                //         }
                //     ],
                //     'votes': [
                //         '123133'
                //     ]
                // }
            }
        },
        methods: {
            // async get_author (author_id) {
            //     //console.log(this.$parent)
            //     this.current_user = await UserService.getCurrentUser()
            //     const resp = await UserService.getUser(this.$cookies.get('api_token'), author_id)
            //     if (resp.data.success) {
            //         this.ticket_author = resp.data.user.name
            //     } else {
            //         alert('Erreur lors de la récuperation de l\'auteur')
            //     }
            // },
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
                console.log(Date.now())
                CommentService.postComment(this.$cookies.get('api_token'), this.ticket._id, 'ticket', this.text_comment)
                this.text_comment = ''
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
