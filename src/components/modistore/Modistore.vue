<template>
    <section class="hero modimo-dark is-fullheight">
        <div class="hero-body">
            <div class="container">
                <div class="columns">
                    <div class="column">
                        <br/>
                        <h1 class="title white-title is-1">
                            Modistore
                        </h1>
                    </div>
                    <div style="margin-top: auto; position: relative" class="column">
                        <input class="input modistore-input-search is-info" type="text" v-model="searchContent" placeholder="Rechercher une application"/>
                        <span class="modistore-search-icon"><i class="fa fa-search"/></span>
                    </div>
                </div>
                <div class="columns is-multiline is-mobile">
                    <div v-for="app in (applicationsFiltered.length ? applicationsFiltered : applications)" :key="app._id" class="column is-one-quarter-widescreen is-one-third-desktop is-full-mobile is-half-tablet"> 
                        <router-link :to="{ name: 'StoreAppDetails', params: { application: app }}">
                            <div class="card modistore-card" style="border-radius: 3px">
                                <div class="card-content modistore-card">
                                    <div class="media is-vertical-center">
                                        <div class="media-left">
                                            <figure class="image is-64x64">
                                            <img :src="app.mini_logo" :alt="app.name">
                                            </figure>
                                        </div>
                                        <div class="media-content ">
                                            <p class="is-size-5 has-text-weight-bold has-text-link modistore-app-name">{{app.shortname}}</p>
                                        </div>
                                        
                                    </div>
                                    <div class="content">
                                        <p class="is-size-7 is-italic has-text-grey-dark modistore-desc">{{app.description}}</p>
                                        <div class="modistore-card-footer">
                                            <span class="button modistore-see-more">Voir plus</span>
                                            <span v-if="app.link && !app.added" @click.stop.prevent @click="addApp(app)" class="button modistore-button">Ajouter</span>
                                            <span v-else-if="app.link && app.added" class="button modistore-button-disabled" disabled>Ajoutée</span>
                                            <span v-else class="button modistore-button-disabled" disabled>Prochainement</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </div>
                    <div v-if="applications && applications.length > 0" class="column is-one-quarter-widescreen is-one-third-desktop is-full-mobile is-half-tablet"> 
                        <div class="card" style="border-radius: 3px; opacity: 0.5">
                            <div class="card-content modistore-card">
                                <div class="media is-vertical-center">
                                    <div class="media-left">
                                        <figure class="image is-64x64">
                                        <img src="/static/img/comingsoon.png" alt="Analytics">
                                        </figure>
                                    </div>
                                    <div class="media-content ">
                                        <p class="is-size-5 has-text-weight-bold has-text-dark modistore-app-name">Prochainement</p>
                                    </div>
                                </div>
                                <div class="content">
                                    <p class="is-size-7 is-italic has-text-grey-dark">Pleins d'applications à venir !</p>
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
import ModistoreService from '@/services/ModistoreService'
import ApplicationService from '@/services/ApplicationService'

export default {
    name: 'modistore',
    data () {
        return {
            current_user: null,
            applications: [],
            searchContent: "",
            applicationsFiltered: []
        }
    },

    created: function () {
        this.load()
    },

    watch: {
        searchContent: function(newSearch) {
            console.log(this.search(newSearch));
            this.applicationsFiltered = this.search(newSearch);
        }
    },
    methods: {
        async getApps () {
            const resp = await ModistoreService.getAllApplications(this.$cookies.get('api_token'));
            if (resp.data.sucess) {
                this.applications = resp.data.applications;
                this.applications.splice(this.applications.findIndex(a => a.shortname === "ModiStore"), 1);
                this.applications.forEach(app => {
                    if (this.current_user.application_list.findIndex(a => a === app._id) != -1)
                        app.added = true;
                });
                this.applications = this.applications.sort((a, b) => {
                    if (a.link === undefined && b.link !== undefined) return 1
                    if (b.link === undefined && a.link !== undefined) return -1
                    if (a.added === true && b.added !== true) return 1
                    if (b.added === true && a.added !== true) return -1
                    return 0
                });
            } else {
                this.$parent.notification = {type: 'failure', message: 'Erreur lors de la récupération des applications'}
            }
        },

        async load () {
            await this.$parent.getCurrentUser();
            this.current_user =  this.$parent.currentUser;
            await this.getApps()
        },

        addApp: function(app) {
            ApplicationService.addUserApplication(this.$cookies.get('api_token'), app._id)
            .then(response => {
                if (response.data.success) {
                    let tmp = this.applications.slice();
                    tmp.find(a => a._id === app._id).added = true;
                    this.applications = tmp;
                    if (this.applicationsFiltered.length) {
                        this.applicationsFiltered.find(a => a._id === app._id).added = true;
                        this.applicationsFiltered = this.applicationsFiltered;
                    }
                }
                else {
                    this.$parent.notification = {type: 'failure', message: "Erreur lors de la suppression de l'application"}
                }
            })
        },

        search: function(search) {
            const lowerSearch = search.toLowerCase();
            return this.applications.filter((app) => {
                if (app.name.toLowerCase().search(lowerSearch) != -1 || app.shortname.toLowerCase().search(lowerSearch) != -1 ||
                    app.small_description.toLowerCase().search(lowerSearch) != -1 || app.description.toLowerCase().search(lowerSearch) != -1)
                        return true;
                return false;
            })
        }
    },
}

</script>

<style lang="scss">
@import './scss/ModiStore.scss';
@import '../../styles/global.scss';
</style>