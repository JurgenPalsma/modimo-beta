<template>
    <section>
        <div class="modal is-active">
            <div class="modal-background" @click="$emit('close_modal')"></div>
                <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Modifier L'affiche</p>
                    <button class="delete" aria-label="close" @click="$emit('close_modal')"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">Titre</label>
                        <div class="control">
                            <input class="input" type="text" v-model="info.title" placeholder="Titre de votre affiche...">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Information</label>
                        <div class="control">
                            <textarea class="textarea" v-model="info.content" placeholder="Information de votre affiche..."></textarea>
                        </div>
                    </div>                
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="updateInformation(info._id, info.title, info.content)">Modifier</button>
                    <button class="button" @click="$emit('close_modal')">Annuler</button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>
import BillboardService from "@/services/BillboardService";

export default {
  name: "BillboardModification",
  props: ["info"],
  data() {
    return {
      isActive: true
    };
  },

  methods: {
    updateInformation: function(id, title, content) {
      BillboardService.updateInfo(
        this.$cookies.get("api_token"),
        id,
        title,
        content
      ).then(response => {
        if (response.data.success) {
          this.$parent.notification = {
            type: "success",
            message: "Update Information Success"
          };
        }
      });
      this.$emit("close_modal");
    }
  }
};
</script>