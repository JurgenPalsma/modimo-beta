<template>
    <section>
        <div class="modal is-active">
            <div class="my-modal-background modal-background" style="opacity:50%;" @click="$emit('close_modal')"></div>
            <div class="modal-content">
                <div class="box">
                    <button class="delete is-pulled-right" aria-label="close" @click="$emit('close_modal')"></button>
                    <div class="media-content">
                        <div class="content">
                            <strong class="modimo-color modimo-size">Contact1</strong>
                            <br>
                            <span ref="display_ticket">Contact2</span>
                            <!--ICI LE CHAMP QUI APPARAIT POUR LA MODIF DU MESSAGE-->
                            <div ref="space_modif_ticket" class="media-content" v-bind:style="{display: 'none'}">
                                <br>
                                <div class="field">
                                    <p class="control">
                                        <textarea ref="text_modif_ticket" v-bind:value=Contact3 class="textarea" rows="1"></textarea>
                                    </p>
                                </div>
                                <div class="field">
                                    <p class="control is-pulled-right">
                                        <button class="button">Modifier</button>
                                    </p>
                                </div>
                            </div>
                            <br>
                        </div>
                        <article class="media">
                            <div class="media-content comment">
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
        name: 'contact',
        data () {
            return {
            }
        },
        methods: {

        }
    }
</script>
<style lang="scss">       
</style>