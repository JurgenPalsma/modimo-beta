<template>
    <section>
        <div class="modal is-active">
            <div class="my-modal-background modal-background" style="opacity:50%;" @click="$emit('close_modal')"></div>
            <div class="modal-content">
                <div class="box">
                    <button class="delete is-pulled-right" aria-label="close" @click="$emit('close_modal')"></button>
                    <div class="media-content">
                        <div class="content">
                            <strong class="modimo-color modimo-size">Formulaire de Contact</strong>
                            <br>
                            <div class="field">
                                <label class="label">Nom</label>
                                <div class="control">
                                    <input class="input" type="text" placeholder="Votre Nom">
                                </div>
                                </div>

                                <div class="field">
                                <label class="label">Mail</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input class="input" type="email" placeholder="Votre Mail" value="">
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-envelope"></i>
                                    </span>
                                    <!-- <span class="icon is-small is-right">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    </span> -->
                                </div>
                                </div>

                                <div class="field">
                                <label class="label">Message</label>
                                <div class="control">
                                    <textarea class="textarea" placeholder="Votre Texte"></textarea>
                                </div>
                                </div>

                                <!--div class="field">
                                <div class="control">
                                    <label class="checkbox">
                                    <input type="checkbox">
                                    I agree to the <a href="#">terms and conditions</a>
                                    </label>
                                </div>
                                </div-->

                                <div class="field is-grouped">
                                <div class="control">
                                    <button class="button is-link">Submit</button>
                                </div>
                                <div class="control">
                                    <button class="button is-text">Cancel</button>
                                </div>
                                </div>
                        </div>
                    </div>
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
<style lang="scss" src="./tickets/scss/Tickets.scss">       
</style>