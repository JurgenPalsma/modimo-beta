<template>
    
</template>

<script>
import ModistoreService from '@/services/ModistoreService'

export default {
    name: 'modistore',
    data () {
        return {
            current_user: null,
            applications: []
        }
    },

    mounted: function () {
        this.load()
    },

    methods: {

        async getApps () {
            const resp = await ModistoreService.getAllApplications(this.$cookies.get('api_token'));
            if (resp.data.sucess) {
                this.applications = resp.data.applications
                this.applications.splice(this.applications.findIndex(a => a.shortname === "ModiStore"), 1);
            } else {
                this.$parent.notification = {type: 'failure', message: 'Erreur lors de la récupération des applications'}
            }
        },

        async load () {
            await this.getApps()
        }
    },
}

</script>

<style lang="scss">
@import './scss/ModiStore.scss';
@import '../../styles/global.scss';
</style>