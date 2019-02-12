<template>
  <section class="hero modimo-dark is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column">
            <br>
            <h1 @click="clearSearch" class="title white-title is-1" style="cursor:pointer">Modistore</h1>
          </div>
          <div style="margin-top: auto; position: relative" class="column">
            <input
              class="input modistore-input-search is-info"
              type="text"
              v-model="searchContent"
              placeholder="Rechercher une application"
            >
            <span class="modistore-search-icon">
              <i class="fa fa-search"/>
            </span>
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter-desktop is-full-mobile">
            <div class="modistore-labels-container">
              <h1 class="modistore-label-title">Catégories</h1>
              <span
                v-for="label in labels"
                :key="label._id"
                class="button is-medium"
                @click="selectLabel(label)"
              >{{label.name}}</span>
            </div>
          </div>
          <div class="column is-three-quarter-desktop is-full-mobile">
            <div class="columns is-multiline is-mobile">
              <div
                v-for="app in (searchContent.length ? applicationsFiltered : applications)"
                v-if="(app.admin && (current_user.roles.includes('ROOT') || current_user.roles.includes('CARETAKER') || current_user.roles.includes('ADMIN'))) || !app.admin"
                :key="app._id"
                class="column is-one-third-widescreen is-half-desktop is-full-mobile is-full-tablet">
                <a @click="$router.push({ name: 'StoreAppDetails', params: { application: app }})">
                  <div class="card modistore-card" style="border-radius: 3px">
                    <div class="card-content modistore-card">
                      <div class="media is-vertical-align">
                        <div class="media-left">
                          <figure class="image is-64x64">
                            <img :src="app.mini_logo" :alt="app.name">
                          </figure>
                        </div>
                        <div class="media-content">
                          <p
                            class="is-size-5 has-text-weight-bold has-text-link modistore-app-name"
                          >{{app.shortname}}</p>
                        </div>
                      </div>
                      <div class="content">
                        <p
                          class="is-size-7 is-italic has-text-grey-dark modistore-desc"
                        >{{app.small_description}}</p>
                        <div class="modistore-card-footer">
                          <span class="button modistore-see-more">Voir plus</span>
                          <span
                            v-if="app.link && !app.added && (!app.admin || current_user.roles.includes('ADMIN') || current_user.roles.includes('ADMIN'))"
                            @click.stop.prevent
                            @click="addApp(app)"
                            class="button modistore-button"
                          >Ajouter</span>
                          <span
                            v-else-if="app.link && app.added"
                            @click.stop.prevent
                            @click="$router.push(app.link)"
                            class="button modistore-button-open"
                          >Ouvrir</span>
                          <span v-else-if="(!app.admin || current_user.roles.includes('ADMIN') || current_user.roles.includes('ADMIN'))" class="button modistore-button-disabled" disabled>À venir</span>
                          <span v-else class="button modistore-button-disabled" disabled>Ajouter</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              <div
                v-if="applications && applications.length > 0"
                class="column is-one-third-widescreen is-half-desktop is-full-mobile is-full-tablet"
              >
                <div class="card" style="border-radius: 3px; opacity: 0.5">
                  <div class="card-content modistore-card">
                    <div class="media is-vertical-align">
                      <div class="media-left">
                        <figure class="image is-64x64">
                          <img src="/static/img/comingsoon.png" alt="Analytics">
                        </figure>
                      </div>
                      <div class="media-content">
                        <p
                          class="is-size-5 has-text-weight-bold has-text-dark modistore-app-name"
                        >Prochainement</p>
                      </div>
                    </div>
                    <div class="content">
                      <p
                        class="is-size-7 is-italic has-text-grey-dark"
                      >Plein d'applications à venir !</p>
                    </div>
                  </div>
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
import ModistoreService from "@/services/ModistoreService";
import ApplicationService from "@/services/ApplicationService";

export default {
  name: "modistore",
  data() {
    return {
      current_user: null,
      applications: [],
      searchContent: "",
      applicationsFiltered: [],
      labels: []
    };
  },

  created: function() {
    this.load();
  },

  watch: {
    searchContent: function(newSearch) {
      this.applicationsFiltered = this.search(newSearch);
    }
  },
  methods: {
    clearSearch: function() {
      this.searchContent = "";
      this.applicationsFiltered = [];
    },
    async selectLabel(label) {
      this.searchContent = label.name;
      const resp = await ModistoreService.getAllAppsByLabel(
        this.$cookies.get("api_token"),
        label.name
      );
      if (resp.data.sucess) {
        let apps = resp.data.applications;
        apps.forEach(app => {
          if (
            this.current_user.application_list.findIndex(a => a === app._id) !=
            -1
          )
            app.added = true;
        });
        this.applicationsFiltered = apps;
      } else {
        this.applicationsFiltered = [];
      }
    },
    async getApps() {
      const resp = await ModistoreService.getAllApplications(
        this.$cookies.get("api_token")
      );
      if (resp.data.sucess) {
        this.applications = resp.data.applications;
        this.applications.splice(
          this.applications.findIndex(a => a.shortname === "ModiStore"),
          1
        );
        this.applications.forEach(app => {
          if (
            this.current_user.application_list.findIndex(a => a === app._id) !=
            -1
          )
            app.added = true;
        });
        this.applications = this.applications.sort((a, b) => {
          if (a.link === undefined && b.link !== undefined) return 1;
          if (b.link === undefined && a.link !== undefined) return -1;
          if (a.added === true && b.added !== true) return 1;
          if (b.added === true && a.added !== true) return -1;
          return 0;
        });
      } else {
        this.$parent.notification = {
          type: "failure",
          message: "Erreur lors de la récupération des applications"
        };
      }
    },

    async getLabels() {
      const resp = await ModistoreService.getAllLabels(
        this.$cookies.get("api_token")
      );
      if (resp.data.sucess) {
        this.labels = resp.data.labels;
      } else {
        this.$parent.notification = {
          type: "failure",
          message: "Erreur lors de la récupération des labels."
        };
      }
    },

    async load() {
      await this.$parent.getCurrentUser();
      this.current_user = this.$parent.currentUser;
      this.getApps();
      this.getLabels();
    },

    addApp: function(app) {
      ApplicationService.addUserApplication(
        this.$cookies.get("api_token"),
        app._id
      ).then(response => {
        if (response.data.success) {
          let tmp = this.applications.slice();
          tmp.find(a => a._id === app._id).added = true;
          this.applications = tmp;
          if (this.applicationsFiltered.length) {
            this.applicationsFiltered.find(a => a._id === app._id).added = true;
            this.applicationsFiltered = this.applicationsFiltered;
          }
        } else {
          this.$parent.notification = {
            type: "failure",
            message: "Erreur lors de la suppression de l'application"
          };
        }
      });
    },

    search: async function(search) {
      if (search.length) {
        let resp = await ModistoreService.getAppsBySearchName(
          this.$cookies.get("api_token"),
          search
        );
        if (resp.data.sucess) {
          let apps = resp.data.applications;
          apps.forEach(app => {
            if (
              this.current_user.application_list.findIndex(
                a => a === app._id
              ) != -1
            )
              app.added = true;
          });
          this.applicationsFiltered = apps;
        } else {
          this.applicationsFiltered = [];
        }
      } else {
        this.clearSearch();
      }
    }
  }
};
</script>

<style lang="scss">
@import "./scss/ModiStore.scss";
@import "../../styles/global.scss";
</style>