<template>
    <section>
        <div class="modal is-active">
            <div class="modal-background" @click="$emit('close_modal')"></div>
                <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Nouvel Utilisateur</p>
                    <button class="delete" aria-label="close" @click="$emit('close_modal')"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">Adresse Email</label>
                        <div class="control">
                            <input class="input" type="text" v-model="email" placeholder="Mail de l'utilisateur">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Nom</label>
                        <div class="control">
                            <textarea class="textarea" v-model="name" placeholder="Nom de l'utilisateur"></textarea>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Role</label>
                        <div class="control">
                            <textarea class="textarea" v-model="name" placeholder="Role de l'utilisateur"></textarea>
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success create-ticket-button" @click="postUser">Créer</button>
                    <button class="button" @click="$emit('close_modal')">Annuler</button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>
import UserService from '@/services/UserService'

export default {
    name: 'userCreation',
    data () {
        return {
            email: '',
            name: '',
            roles: [],
            currentUser: {},
            isActive: true
        }
    },
    methods: {
        postUser: function () {
            UserService.createUserFromAdmin(this.$cookies.get('api_token'), this.email, this.name, this.$parent.getCurrentUser().residence._id, this.roles)
            .then(response => {
                if (!response.data.success)
                    this.$parent.$parent.notification = {type: 'failure', message: "Un champ est manquant"}
                else
                    this.$emit('close_modal', response.data.user);
            })
        }
    }
}
</script>

<style lang="scss">

</style>
