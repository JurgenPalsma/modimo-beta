<template>
  <section>
    <div class="modal is-active">
      <div class="modal-background" @click="$emit('close_modal')"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <div style="display: flex;">
            <p class="modal-card-title">Nouvelle Affiche</p>
            <button class="delete" aria-label="close" @click="$emit('close_modal')"></button>
          </div>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Titre</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="title"
                placeholder="Titre de votre affiche..."
              >
            </div>
          </div>

          <div class="field">
            <label class="label">Information</label>
            <div class="control">
              <textarea
                class="textarea"
                v-model="content"
                placeholder="Information de votre affiche..."
              ></textarea>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="postInformation">Créer</button>
          <button class="button" @click="$emit('close_modal')">Annuler</button>
        </footer>
      </div>
    </div>
  </section>
</template>

<script>
import BillboardService from "@/services/BillboardService";

export default {
  name: "BillboardCreation",
  data() {
    return {
      title: "",
      content: "",
      isActive: true
    };
  },
  methods: {
    postInformation: function() {
      BillboardService.postInfo(
        this.$cookies.get("api_token"),
        this.title,
        this.content
      ).then(response => {
        if (!response.data.success || !response.data.info)
          this.$parent.$parent.notification = {
            type: "failure",
            message: "Un champ est manquant"
          };
        else {
          this.$parent.load();
          this.$emit("close_modal", response.data.info);
        }
      });
    }
  }
};
</script>