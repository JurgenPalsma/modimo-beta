<template>
    <section class="hero is-fullheight modimo-dark">
        <div class="hero-body">
            <div class="container">
                <br/>
                <div class="tile is-vertical">
                    <div class="tile">
                        <div class="tile">
                            <article class="tile is-child notification is-white">
                                
                                <nav class="level modistore-appdetail-header">
                                    <div class="level-left">
                                        <p @click="$router.push('/modistore')" class="modistore-button-back">Retour</p>
                                    </div>
                                    <!-- Left side -->
                                    <div class="level-center">
                                        <div class="level-item has-text-center">
                                            <p class="title is-3">
                                                <strong>{{app.name}}</strong>
                                            </p>
                                        </div>
                                    </div>
                                        
                                    <!-- Right side -->
                                    <div class="level-right">
                                        <p class="level-item">
                                            <i v-for="i in app.rate_average" :key="i" class="fas fa-star has-text-info"></i>
                                            <i v-for="j in 5 - app.rate_average" :key="j + app.rate_average"  class="fas fa-star"></i>
                                        </p>
                                    </div>
                                </nav>

                                <div >
                                    <div class="content card-image">
                                        <figure class="image">
                                            <div class="modistore-app-logo-container">
                                                <img :src="app.logo" class="modistore-app-img" alt="Placeholder image">
                                                <img src="../../../static/img/imac-top.png" class="modistore-app-mac-top"/>
                                                <img src="../../../static/img/imac-top.png" class="modistore-app-mac-top2"/>
                                            </div>
                                            <img src="../../../static/img/imac-base.png" class="modistore-app-mac-base"/>
                                        </figure>
                                        <p class="has-text-centered has-text-grey-light"> {{app.small_description}} </p>
                                    </div>
                                    <div class="content">
                                    <div class="tags">
                                        <span v-for="tagName in app.label_name" :key="tagName" class="tag is-medium">{{tagName}}</span>
                                    </div>
                                        <p class="is-size-7 has-text-grey-light"> Mis à jour le: {{dateFormater(app.updated_at)}}</p>
                                    </div>
                                    <div class="content">
                                        <h3 class="subtitle">Description</h3>
                                        
                                        <p>
                                            {{app.description}}
                                        </p>
                                    </div>
                                
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import moment from "moment";

    export default {
        props: ['application'],
        name: 'StoreAppDetails',
        data () {
            return {
                app: {
                    name: "Nom de l'app",
                    shortname: "app",
                    link: "",
                    logo: "/static/img/appmockup.png",
                    author_name: "author",
                    rate_average: 3,
                    rate_count: Number,
                    updated_at: new Date(),
                    small_description: "Description courte de l'app",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Why do we use it?It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
                    version: "1.0",
                    label_name: ["Label1", "Label2", "Label3"]
                }
            }
        },
        created() {
            if (this.application) {
                this.app.name = this.application.shortname
                this.app.rate_average = Number(this.application.rate_average.toFixed())
                this.app.updated_at = this.application.updated_at
                this.app.small_description = this.application.small_description
                this.app.description = this.application.description
                this.app.label_name = this.application.label_name
                this.app.logo = this.application.logo


            } else {
                this.$router.push('/modistore');
            }
        }, 
        methods: {
            dateFormater(unFormatedDate) {
                var date = moment(String(unFormatedDate)).format("MM/DD/YYYY");
                return date;
            }
        },
    }
</script>
<style lang="scss"> 
@import '../../styles/global.scss';
@import './scss/ModiStore.scss';

.is-horizontal-center {
	justify-content: center;
}
</style>
