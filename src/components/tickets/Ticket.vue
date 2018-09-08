<template>
    <section>
        <div class="modal is-active">
            <div class="modal-background" style="opacity:50%;" @click="$emit('close_modal')"></div>
            <div class="modal-content">
                <!-- Any other Bulma elements you want -->
                <div class="box">
                    <button class="delete is-pulled-right" aria-label="close" @click="$emit('close_modal')"></button>
                    <div class="media-content">
                        <div class="content">
                            <p>
                                <strong class="modimo-color modimo-size"><!--{{ticket.author_id}}-->Jean-Pierre_Gardien - {{ticket.title}}</strong>
                                <br>
                                {{ticket.content}}
                                <br>
                                <small class="small-text">
                                    <span v-if="ticket.updated_at.$date === ticket.created_at.$date">Crée le </span>
                                    <span v-else>Modifié le </span>
                                    {{ticket.updated_at.$date}}
                                    <!-- ICI IL FAUT AFFICHER SEULEMENT SI L'AUTEUR EST LA PERSONNE CONNECTEE ET LANCER UNE MODAL ptetre celle de creation de ticket POUR MODIFIER LE TICKET-->
                                    <!--<span v-if="ticket.author_id === session._id">--> · <a>Modifier ticket</a><!--</span>-->
                                </small>
                            </p>
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
                                    <textarea class="textarea" rows="1" placeholder="Add a comment..."></textarea>
                                </p>
                            </div>
                            <div class="field">
                                <p class="control">
                                    <button class="button">Commenter</button>
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
            <!--<button class="modal-close is-large" aria-label="close" @click="$emit('close_modal')"></button>-->
        </div>
    </section>
</template>

<script>
    export default {
        name: 'ticket',
        data () {
            return {
                isActive: true,
                ticket: {
                    '_id': '123133',
                    'title': 'Du feu dans la cheminée',
                    'content': 'mon ascenceur est cassé, j\'ai envie d\'une pomme.',
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
                            'content': 'c\'est un vrai problème',
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
                            'content': 'Je suis d\'accord',
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
        methods: {}
    }
</script>

<style lang="scss">       
</style>