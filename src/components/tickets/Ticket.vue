<template>
    <section>
        <div class="modal is-active">
            <div class="modal-background"></div>
                <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">{{ ticket.title }}</p>
                    <button class="delete" aria-label="close" @click="$emit('close_modal')"></button>
                </header>
                <section class="modal-card-body">
                    <!-- Content ... -->
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success">Save changes</button>
                    <button class="button" @click="$emit('close_modal')">Cancel</button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'ticket',
    props: ['ticket'],
    data () {
        return {
            isActive: true
        }
    },
    methods: {}
}

</script>

<style lang="scss">

       
</style>