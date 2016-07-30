<template>
  <div class="submission">
    <h1 class="title has-text-centered">{{ title }}</h1>
    <div class="columns">
      <div class="column is-6 is-offset-3">
        <div class="notification is-danger" v-show="error">{{ error }}</div>
        <div class="notification is-success" v-show="successMessage">{{ successMessage }}</div>
        <div class="notification is-warning" v-show="!loading && !apps.length">No submissions yet</div>
        <pulse-loader :class="'has-text-centered'" :loading="loading" :color="'#1fc8db'"></pulse-loader>
        <div class="app-list" v-show="!loading && apps.length">
          <a class="app-row" v-link="{ path: `/submission/${app.id}` }" v-for="app in apps">
            <img class="app-icon" :src="app.iconUrl">
            <h5 class="title">{{ app.title }}</h5>
          </a>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

import store from '../store';

export default {
  name: 'EditEntryListView',
  components: {
    PulseLoader
  },
  data() {
    return {
      title: 'Demo Day submission',
      apps: [],
      loading: true,
      error: null,
      successMessage: null
    };
  },
  route: {
    data({ to: { query } }) {
      if (query.created) {
        this.successMessage = 'Thank you! Your changes have been saved.';
      }

      return store
        .getApps()
        .then(apps => ({
          apps,
          loading: false
        }))
        .catch(err => ({
          error: err.message || err
        }));
    }
  }
};
</script>

<style lang="stylus" scoped>
.control
  text-align: center
.v-spinner, .checkbox
  padding: 10px
.app-list
  border: 1px solid #d3d6db;
  border-radius: 4px;
.app-row
  align-items: center
  display: flex
  flex-direction: row
  padding: 10px
  &:hover
    background-color: rgba(0, 0, 0, 0.05)
.app-icon
  width: 50px
  height: 50px
  margin-right: 10px
</style>
