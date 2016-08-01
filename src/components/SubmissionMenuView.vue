<template>
  <section class="section app-content">
    <div class="container">
      <h1 class="title has-text-centered">{{ title }}</h1>
      <div class="columns">
        <div class="column is-6 is-offset-3">
          <a class="button is-large is-fullwidth" v-link="{ path: '/submission/new' }">Add a new app</a>
          <a class="button is-large is-fullwidth" v-link="{ path: '/submission/list' }">Edit an existing app</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SubmissionMenuView',
  data() {
    return {
      title: 'Demo Day submission'
    };
  },
  watch: {
    title(title) {
      document.title = title;
    }
  }
};
</script>

<style lang="stylus" scoped>
.button
  margin: 10px 0
</style>
