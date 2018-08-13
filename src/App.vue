<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
    name: 'app',
    mounted () {
        if (this.$cookies.get('api_token')) {
        } else {
            this.$router.push('/')
        }
    }
}
</script>

<style lang="scss">
</style>
