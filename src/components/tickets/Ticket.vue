<template>
    <section class="container">
        <div class="card">
            <header class="card-header">
                <p class="card-header-title">
                Ticket title
                </p>
                <a @click="toggle" class="card-header-icon" >
                <span v-if="!toggled" class="icon" > <i class="fas fa-angle-left" ></i></span>
                <span v-else-if="toggled" class="icon" > <i class="fas fa-angle-up" ></i></span>
                </a>
            </header>
            <div v-if="toggled" class="card-content">
                <div> Author </div> 
                <div> 12/01/10 </div>
                <div class="content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
                <br>
                <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                </div>
            </div>
            <footer class="card-footer">
                <a href="#" class="card-footer-item">Save</a>
                <a href="#" class="card-footer-item">Edit</a>
                <a href="#" class="card-footer-item">Delete</a>
            </footer>
        </div>
   </section>
</template>

<script>
export default {
    name: 'home',
    data () {
        return {
            toggled: false
        }
    },
    methods: {
        toggle: function () {
            this.toggled = !this.toggled
        }
    }
}
</script>

<style lang="scss">

</style>