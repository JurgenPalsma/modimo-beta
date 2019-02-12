<template>
    <section>
        <div class="modal is-active">
            <div class="modal-background" @click="$emit('close_modal')"></div>
                <div class="modal-card">
                <header class="modal-card-head">
                    <div style="display: flex">
                        <p class="modal-card-title">Bonjour <span class="modal-card-title" style="color: #2b5bb2">{{$parent.$parent.currentUser && $parent.$parent.currentUser.name ? $parent.$parent.currentUser.name.substr(0, $parent.$parent.currentUser.name.search(' ')) : ""}}</span></p>
                        <button class="delete" aria-label="close" @click="$emit('close_modal')"></button>
                    </div>
                </header>
                <section class="modal-card-body">
                    <div>
                        

                    </div>
                    <div class="field">
                        <label class="label" style="text-align: center">
                            <img src="/static/img/logo_full.png" style="height: 80px;width: auto; margin-bottom: 10px"/>
                            <p v-if="$parent.$parent.currentUser && $parent.$parent.currentUser.roles && $parent.$parent.currentUser.roles.length === 0" style="text-align: left; margin-bottom: 10px">Bienvenue dans votre résidence connectée !</p>
                            <p v-else style="text-align: left; margin-bottom: 10px">Bienvenue dans votre futur outil de gestion de résidence!</p>
                            <p v-if="$parent.$parent.currentUser && $parent.$parent.currentUser.roles && $parent.$parent.currentUser.roles.length === 0" style="text-align: left; font-weight: 100">Nous travaillons activement pour vous proposer un service confortable qui s'adapte à vos besoins. Simplifiez vos démarches et échanges avec tout les acteurs de votre résidence grâce à une multitude d'applications comme <a href="/tickets">Tickets</a> ou <a href="/messaging">Messagerie</a>.<br/><br/>Nous nous voulons à l'écoute de vos remarques et restons disponible afin d'améliorer au mieux votre expérience Modimo.<br/><br/>Vous pouvez nous joindre à tout moment par email : <a href="mailto:modimoteam@gmail.com" style="color: #2b5bb2">modimoteam@gmail.com</a>.</p>
                            <p v-else style="text-align: left; font-weight: 100">On vous a concocté une multitude de fonctionnalités au sein de cette plateforme. Par exemple, vous pouvez resencer les requêtes de vos résidents et vos taches dans l'application <a href="/tickets">Tickets</a>, et les informer de l'avancée de vos travaux en temps réel!  Nous travaillons dur pour fournir des fonctionalités de qualité que vous pouvez tester depuis le <a href="/modistore">Modistore</a>.<br/><br/>Nous avons hate d'en discuter avec vous!<br/><br/>Modimo<br/><a href="mailto:modimoteam@gmail.com" style="color: #2b5bb2">modimoteam@gmail.com</a></p>
                        </label>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button" @click="$emit('close_modal')">Allons-y !</button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>

export default {
    name: 'firstTimeModal',
    data () {
        return {
            isActive: true
        }
    },
    methods: {
        readIntro: function () {  
            this.$parent.first_time_modal;
        }
    }
}
</script>

<style lang="scss">

</style>