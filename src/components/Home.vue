<template>
    <section class="hero modimo-dark is-fullheight">
        <div class="hero-body">
            <div class="container">
                <br/>
                <div class="columns">
                    <div class="column has-text-left">
                        <h1 class="title white-title is-1">
                            Applications
                        </h1>
                    </div>
                    <div style="margin-top: auto; position: relative" class="column has-text-right">
                        <span v-if="editMode" class="modimo-home-edit" @click="editModeFalse">Terminer</span>
                        <span v-else class="modimo-home-edit" @click="editModeTrue">Modifier</span>
                    </div>
                </div>
                
                <div class="columns is-multiline is-mobile">
                    <router-link v-for="app in applications" :key="app._id" :to="app.link" style="position: relative" class="column is-12-mobile is-6-tablet is-4-desktop is-3-widescreen">
                        <div class="card" style="border-radius: 3px">
                            <span v-if="editMode && app.shortname != 'ModiStore'" class="edit-remove"><i class="fa fa-times"/></span>
                            <div @click.stop.prevent @click="deleteApp(app)" v-if="editMode && app.shortname != 'ModiStore'" class="edit-card">
                                <span class="edit-remove-confirm"><i class="fa fa-times"/></span>
                                <span>Supprimer</span>
                            </div>
                            <div class="card-content">
                                <div class="media is-vertical-center">
                                    <div class="media-left">
                                        <figure class="image is-64x64">
                                            <img :src="app.mini_logo" :alt="app.shortname">
                                        </figure>
                                    </div>
                                    <div class="media-content">
                                        <p class="is-size-5 has-text-weight-bold modimo-app-title">{{app.shortname}}</p>
                                        <p class="is-size-7 is-italic has-text-grey-dark modimo-app-description">{{app.small_description}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import AuthService from '@/services/AuthService'
import ModistoreService from '@/services/ModistoreService'
import ApplicationService from '@/services/ApplicationService'

export default {
    name: 'home',
    data () {
        return {
            current_user: null,
            applications: [],
            editMode: false
        }
    },

    created: function () {
        this.load()
    },

    methods: {
        async load () {
            await this.$parent.getCurrentUser();
            this.current_user =  this.$parent.currentUser;
            ModistoreService.getMyInstalledApplications(this.$cookies.get('api_token'))
            .then(response => {
                this.applications = response.data.applications;
            })
        },
        logout: function () {
            AuthService.logout(this.$cookies.get('api_token'))
            this.$cookies.remove('api_token')
            this.$router.push('/')
        },
        deleteApp: async function (app) {
            let response = await ApplicationService.deleteUserApplication(this.$cookies.get('api_token'), app._id)
            if (response.data.success) {
                let tmp = this.applications.slice();
                tmp.splice(tmp.findIndex(a => (a._id === app._id)), 1);
                this.applications = tmp;
            }
            else {
                this.$parent.notification = {type: 'failure', message: "Erreur lors de la suppression de l'application"}
            }
        },
        editModeTrue: function() {
            this.editMode = true;
        },
        editModeFalse: function() {
            this.editMode = false;
        }
    }
}
</script>
<style lang="scss">
.modimo-home-edit:hover {
    text-decoration: underline;
    cursor: pointer;
}

.edit-remove {
    color: gray;
    position: absolute;
    right: 10px;
    top: 5px;
    z-index: 100;
}

.edit-remove-confirm {
    color: white;
    position: absolute;
    right: 10px;
    top: 5px;
    z-index: 100;
}

.edit-card {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 100;
    opacity: 0;
    align-items: center;
    justify-content: center;
}

.edit-card:hover {
    background-color: #000;
    border-radius: 3px;
    opacity: 0.85;
    display: flex;
    color: white;
    cursor: pointer;
}

.edit-card span:hover {
    font-weight: bold;
}

@import '../styles/landing.scss';
@import '../styles/global.scss';
</style>
