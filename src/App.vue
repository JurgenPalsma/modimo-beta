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
      // TODO: fill user info here
      this.$router.push('home')
    } else {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
</style>
