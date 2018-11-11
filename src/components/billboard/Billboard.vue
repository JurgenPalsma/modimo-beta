<style lang="scss">
@import "./scss/Billboard.scss";
@import "../../styles/global.scss";
</style>

<template>
  <section class="hero modimo-dark is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="title has-text-centered white-title padding-header">
          Informations
          <a @click="showModalBillboardCreation = true" class="super-button">+</a>
        </div>

          <div class="tile is-ancestor">
            <div v-for="info in thirdFirstInformations" :key="info._id" class="tile">
              <div class="tile is-parent is-vertical">
                <article class="tile is-child box">
                <button v-if="current_user && current_user.roles && (current_user.roles.includes('ROOT') || current_user.roles.includes('CARETAKER') || current_user.roles.includes('ADMIN'))" style="float: right" class="delete" aria-label="close" @click="deleteInformation(info._id)"></button>
                  <p class="title" @click="idToModal(info)" >{{ info.title }}</p>
                  <p class="content">{{ info.content }}</p>
                  <!-- <p class="is-size-7" style="float: left">{{info.author_id}}</p> -->
                  <p class="is-size-7 has-text-grey-light" style="float: right">Mis à jour le : {{dateFormater(info.updated_at)}}</p>
                </article>
              </div>
            </div>
          </div>

          <div class="tile is-ancestor">
            <div class="tile is-vertical">
              <div class="tile">
                <div class="tile is-parent is-vertical" style="margin-top: -20px;">
                  <div v-for="info in twoLeftVerticalInformations" :key="info._id" class="tile" style="margin-top: 20px;"> 
                    <article class="tile is-child box">
                      <button v-if="current_user && current_user.roles && (current_user.roles.includes('ROOT') || current_user.roles.includes('CARETAKER') || current_user.roles.includes('ADMIN'))" style="float: right" class="delete" aria-label="close" @click="deleteInformation(info._id)"></button>
                      <p class="title" @click="idToModal(info)">{{ info.title }}</p>
                      <p class="content">{{ info.content }}</p>
                      <!-- <p class="is-size-7" style="float: left">{{info.author_id}}</p> -->
                      <p class="is-size-7 has-text-grey-light" style="float: right">Mis à jour le : {{dateFormater(info.updated_at)}}</p>
                    </article>
                  </div>
                </div>
                <!-- img -->
                <div v-if="informations.length >= 6" class="tile is-parent">
                  <article class="tile is-child box">

                    <figure class="title image is-4by3">
                      <img src="./../../../static/img/logofull.svg">
                    </figure>
                    <p class="content">Vous souhaite une agréable journée.</p>
                  </article>
                </div>
                <div class="tile is-parent is-vertical" style="margin-top: -20px;">
                  <div v-for="info in twoRightVerticalInformations" :key="info._id" class="tile" style="margin-top: 20px;"> 
                    <article class="tile is-child box">
                      <button v-if="current_user && current_user.roles && (current_user.roles.includes('ROOT') || current_user.roles.includes('CARETAKER') || current_user.roles.includes('ADMIN'))" style="float: right" class="delete" aria-label="close" @click="deleteInformation(info._id)"></button>
                      <p class="title" @click="idToModal(info)">{{ info.title }}</p>
                      <p class="content">{{ info.content }}</p>
                      <!-- <p class="is-size-7" style="float: left">{{info.author_id}}</p> -->
                      <p class="is-size-7 has-text-grey-light" style="float: right">Mis à jour le : {{dateFormater(info.updated_at)}}</p>
                    </article>
                  </div>
                </div>
              </div>
              <div v-if="informations.length >= 7" class="tile is-parent">
                <article class="tile is-child box">
                  <button v-if="current_user && current_user.roles && (current_user.roles.includes('ROOT') || current_user.roles.includes('CARETAKER') || current_user.roles.includes('ADMIN'))" style="float: right" class="delete" aria-label="close" @click="deleteInformation(info._id)"></button>
                  <p class="title" @click="idToModal(info)">{{ wideElement.title }}</p>
                  <div class="content">
                    <p>{{ wideElement.content }}</p>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <div class="tile is-ancestor">
            <div v-for="info in twoBottomInformations" :key="info._Id" class="tile" style="margin-top: 20px;"> 
              <div class="tile is-parent">
                <article class="tile is-child box">
                  <button v-if="current_user && current_user.roles && (current_user.roles.includes('ROOT') || current_user.roles.includes('CARETAKER') || current_user.roles.includes('ADMIN'))" style="float: right" class="delete" aria-label="close" @click="deleteInformation(info._id)"></button>
                  <p class="title" @click="idToModal(info)" >{{ info.title }}</p>
                  <p class="content">{{ info.content }}</p>
                  <!-- <p class="is-size-7" style="float: left">{{info.author_id}}</p> -->
                  <p class="is-size-7 has-text-grey-light" style="float: right">Mis à jour le : {{dateFormater(info.updated_at)}}</p>
                </article>
              </div>
            </div>
          </div>
    
          <BillboardCreation v-show="showModalBillboardCreation" @close_modal="closeModalBillboardCreation"></BillboardCreation>
          <BillboardModification :info="selectedInformation" v-show="showModalBillboardModification" @close_modal="closeModalBillboardModification"></BillboardModification>
      </div>
    </div>
  </section>
</template>

<script>
import BillboardService from "@/services/BillboardService";
import BillboardCreation from "./BillboardCreation.vue";
import BillboardModification from "./BillboardModification.vue";
import moment from "moment";

export default {
  name: "Billboard",
  data() {
    return {
      showModalBillboardCreation: false,
      showModalBillboardModification: false,
      current_user: null,

      informations: [],
      selectedInformation: undefined,

      // Front Element
      thirdElementTmp: [],
      thirdFirstInformations: [],
      twoLeftElementTmp: [],
      twoLeftVerticalInformations: [],
      twoRightElementTmp: [],
      twoRightVerticalInformations: [],
      wideElement: {},
      twoLastElementTmp: [],
      twoBottomInformations: []
    };
  },

  mounted: function() {
    console.log("je passe");
    this.load();
  },

  methods: {
    reload: function() {
      (this.informations = []),
        // Front Element
        (this.thirdElementTmp = []),
        (this.thirdFirstInformations = []),
        (this.twoLeftElementTmp = []),
        (this.twoLeftVerticalInformations = []),
        (this.twoRightElementTmp = []),
        (this.twoRightVerticalInformations = []),
        (this.wideElement = {}),
        (this.twoLastElementTmp = []),
        (this.twoBottomInformations = []),
        this.load();
    },

    informationFactory: function() {
      var x = 0;
      var y = 0;
      var z = 0;
      for (var i = 0; i < this.informations.length; i++) {
        if (i < 3) this.thirdElementTmp[i] = this.informations[i];
        if (i >= 3 && i <= 4)
          this.twoLeftElementTmp[x++] = this.informations[i];
        if (i > 4 && i <= 6)
          this.twoRightElementTmp[y++] = this.informations[i];
        if (i > 6 && i === 7) this.wideElement = this.informations[i];
        if (i > 7 && i <= 9) this.twoLastElementTmp[z++] = this.informations[i];
      }
      this.thirdFirstInformations = this.thirdElementTmp;
      this.twoLeftVerticalInformations = this.twoLeftElementTmp;
      this.twoRightVerticalInformations = this.twoRightElementTmp;
      this.twoBottomInformations = this.twoLastElementTmp;
    },

    closeModalBillboardCreation: function(info) {
      if (info) {
        this.informations.push(info);
        // this.showinfos = this.sortinfos(this.index);
        this.$parent.notification = {
          type: "success",
          message: "info créé avec succès !"
        };
      }
      this.load();
      this.showModalBillboardCreation = false;
    },

    closeModalBillboardModification: function() {
      this.load();
      this.showModalBillboardModification = false;
    },

    idToModal: function(info) {
      this.selectedInformation = info;
      this.showModalBillboardModification = true;
    },

    async load() {
      await this.$parent.getCurrentUser();
      this.current_user =  this.$parent.currentUser;
      const resp = await BillboardService.getInfos(
        this.$cookies.get("api_token")
      );
      if (resp.data.success) {
        this.informations = resp.data.infos;
        this.informationFactory();
      } else {
        this.$parent.notification = {
          type: "failure",
          message:
            "Erreur lors de la récupération des informations du mur d'affiche"
        };
      }
    },

    deleteInformation: function(id) {
      BillboardService.deleteInfo(this.$cookies.get("api_token"), id).then(
        response => {
          if (response.data.success) {
            this.reload();
            this.$parent.notification = {
              type: "success",
              message: "Delete Information Success"
            };
          }
        }
      );
    },

    dateFormater(unFormatedDate) {
      var date = moment(String(unFormatedDate)).format("DD MMMM YYYY, h:mm:ss");
      return date;
    }
  },
  components: {
    BillboardCreation: BillboardCreation,
    BillboardModification: BillboardModification
  }
};
</script>