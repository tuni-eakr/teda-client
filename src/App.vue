<template lang="pug">
  #app
    //- nav.nav
    //-   .navbar-menu
    //-     .navbar-start
    //-       router-link.navbar-item(to="/") Home
    //-       router-link.navbar-item(to="/about") About
    router-view
</template>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
