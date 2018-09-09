<template>
    <section>
        <div class="modal is-active">
            <div class="my-modal-background modal-background" style="opacity:50%;" @click="$emit('close_modal')"></div>
            <div class="modal-content">
                <div class="box">
                    <button class="delete is-pulled-right" aria-label="close" @click="$emit('close_modal')"></button>
                    <div class="media-content">
                        <div class="content">
                            <strong class="modimo-color modimo-size"><!--{{ticket.author_id}}-->Jean-Pierre_Gardien - {{ticket.title}}</strong>
                            <br>
                            <span ref="display_ticket">{{ticket.content}}</span>
                            <!--ICI LE CHAMP QUI APPARAIT POUR LA MODIF DU MESSAGE-->
                            <div ref="space_modif_ticket" class="media-content" v-bind:style="{display: 'none'}">
                                <br>
                                <div class="field">
                                    <p class="control">
                                        <textarea ref="text_modif_ticket" v-bind:value="ticket.content" class="textarea" rows="1"></textarea>
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
                                <span v-if="ticket.updated_at.$date === ticket.created_at.$date">Crée le </span>
                                <span v-else>Modifié le </span>
                                {{ticket.updated_at.$date}}
                                <!-- ICI IL FAUT AFFICHER SEULEMENT SI L'AUTEUR EST LA PERSONNE CONNECTEE -->
                                <!--<span v-if="ticket.author_id === session._id">--> · <a v-on:click="modifTicket">Modifier ticket</a><!--</span>-->
                            </small>
                        </div>
                        <article class="media">
                            <div class="media-content comment">
                                <div v-for="comment in ticket.comments" :key="comment._id" >
                                    <article class="media">
                                    <p>
                                        <strong class="modimo-color">{{comment.author_id}}&nbsp;</strong>
                                        {{comment.content}}
                                        <br>
                                        <small class="small-text">
                                            <span v-if="comment.updated_at.$date === comment.created_at.$date">Crée le </span>
                                            <span v-else>Modifié le </span>{{comment.updated_at.$date}}
                                        </small>
                                    </p>
                                    </article>
                                </div>
                            </div>
                        </article>
                    </div>
                    <!--</article>-->
                    <br>
                    <article class="media">
                        <div class="media-content">
                            <div class="field">
                                <p class="control">
                                    <textarea class="textarea" rows="1" placeholder="Écrit ton commentaire..."></textarea>
                                </p>
                            </div>
                            <div class="field">
                                <p class="control">
                                    <button class="button is-pulled-right">Envoyer</button>
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
    export default {
        name: 'ticket',
        data () {
            return {
                isNone: 'none;',
                isActive: true,
                ticket: {
                    '_id': '123133',
                    'title': 'Du feu dans la cheminée',
                    'content': 'mon ascenseur est cassé, j\'ai envie d\'une pomme.',
                    'author_id': '1238EeGZY3',
                    'residence_id': '1e238aEeGZY3',
                    'status': 'open',
                    'created_at': {
                        '$date': '2018-08-13T10:09:26.236Z'
                    },
                    'updated_at': {
                        '$date': '2018-08-13T10:12:47.414Z'
                    },
                    'comments': [
                        {
                            '_id': '123133',
                            'author_id': 'NadineDu6eme',
                            'content': 'c\'est un vrai problème !',
                            'created_at': {
                                '$date': '2018-08-14T10:09:26.236Z'
                            },
                            'updated_at': {
                                '$date': '2018-08-14T10:09:26.236Z'
                            }
                        },
                        {
                            '_id': '123134',
                            'author_id': 'GastonRDC',
                            'content': 'Je suis d\'accord.',
                            'created_at': {
                                '$date': '2018-08-14T10:09:26.236Z'
                            },
                            'updated_at': {
                                '$date': '2018-08-14T10:12:47.414Z'
                            }
                        }
                    ],
                    'votes': [
                        '123133'
                    ]
                }
            }
        },
        methods: {
            modifTicket: function (event) {
                this.$refs.space_modif_ticket.style = 'display: block;'
                this.$refs.display_ticket.style = 'display: none;'
            },
            cancelModifTicket: function (event) {
                this.$refs.space_modif_ticket.style = 'display: none;'
                this.$refs.display_ticket.style = 'display: block;'
            }
        }
    }
</script>
<style lang="scss">       
</style>