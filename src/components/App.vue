<template>
  <header class="header app-header">
    <div class="container">
      <nav class="nav">
        <div class="nav-left"></div>
        <div class="nav-center">
          <a class="nav-item" id="n17r-logo" href="/">
            <img src="/n17r-logo.png" alt="nFactorial Incubator Logo">
          </a>
        </div>
        <div class="nav-right is-flex"></div>
      </nav>
    </div>
  </header>
  <router-view
    class="animated"
    transition="fade"
    transition-mode="out-in"
    keep-alive>
  </router-view>
  <footer class="footer">
    <div class="container app-footer">
      <p class="has-text-centered"><a href="http://n17r.com/">nFactorial Incubator</a> 2016</p>
    </div>
  </footer>
</template>

<style lang="stylus">
@import "../app.styl"

body
  background-color: #f5f7fa
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
#n17r-logo
  padding: 5px
  height: 50px
  img
    max-height: 50px
.app-header
  background-color: white
  box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1)
  position: fixed
  width: 100%
  z-index: 1024
  .nav-right
    align-items: stretch
    flex: 1
    justify-content: flex-end
    overflow: hidden
    overflow-x: auto
    white-space: nowrap
.app-header + .app-content
  padding-top: 80px
.app-content
  .container > .title
    margin-bottom: 30px
  .v-spinner
    padding: 10px
.animated
  animation-duration: .377s
  animation-fill-mode: both
</style>
