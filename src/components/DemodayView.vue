<template>
  <div class="demoday">
    <div class="columns">
      <div class="column is-10 is-offset-1">
        <div class="notification is-danger" v-show="error">{{ error }}</div>
        <div class="notification is-warning" v-show="!loading && !apps.length">Пока ничего нет – зайдите чуть позже</div>
        <pulse-loader :class="'has-text-centered'" :loading="loading" :color="'#1fc8db'"></pulse-loader>
        <div class="app-cards">
          <div class="app-card" v-for="app in apps" track-by="$index">
            <div class="app-info columns is-mobile" :style="{'background-color': app.iconColor}">
              <div class="app-icon column is-4">
                <figure class="image is-square"><img :src="app.iconUrl"></figure>
              </div>
              <div class="app-text column">
                <a class="app-title" :href="app.websiteUrl">
                  <h2 class="title" :style="{'color': app.textColor}">
                    {{ app.title }}
                  </h2>
                </a>
                <p class="app-description" :style="{'color': app.textColor}">
                  {{ app.description }}
                </p>
                <a class="app-website-link" :style="{'color': app.textColor}" :href="app.websiteUrl">
                  {{ app.cleanWebsiteUrl }}
                </a>
                <a class="app-download-button" href="https://itunes.apple.com/app/id{{ app.appStoreId }}" v-if="app.appStoreId">
                  <img src="/appstore.svg">
                </a>
                <a class="app-download-button" href="https://play.google.com/store/apps/details?id={{ app.googlePlayId }}" v-if="app.googlePlayId">
                  <img src="/googleplay.svg">
                </a>
              </div>
            </div>
            <div class="app-team-member-list">
              <div class="app-team-member columns is-mobile" v-for="teamMember in app.teamMembers">
                <div class="column is-3">
                  <figure class="image is-square"><img :src="teamMember.photoUrl"></figure>
                </div>
                <div class="column">
                  <h4 class="title">{{ teamMember.name }}</h4>
                  <p>{{ teamMember.bio }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Macy from 'macy';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

import store from '../store';

const getYIQ = color => {
  const rgb = color.match(/\d+/g);
  return ((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000;
};
const getNormalizedTextColor = color => (
  getYIQ(color) >= 128
    ? '#222324'
    : 'white'
);

export default {
  name: 'DemodayView',
  components: {
    PulseLoader
  },
  data() {
    return {
      apps: [],
      loading: true,
      error: null
    }
  },
  ready() {
    store
      .getApps()
      .then(apps => {
        this.apps = apps.map(app => _.assign(app, {
          textColor: getNormalizedTextColor(app.iconColor),
          cleanWebsiteUrl: app.websiteUrl.match(/https?:\/\/(?:www)?(.*)/)[1]
        }));
        this.loading = false;

        this.$nextTick(() => {
          Macy.init({
            container: '.app-cards',
            margin: 10,
            columns: 2,
            breakAt: {
              769: 1
            }
          });
        });
      })
      .catch(err => {
        this.error = err.message || err;
      });
  }
};
</script>

<style lang="stylus">
.app-card
  border-radius: 4px
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
  overflow: hidden
  .columns
    align-items: center
    margin: 0
    .title
      font-weight: 500
  .app-info
    padding: 30px 15px
  .app-title
    display: block
    margin-bottom: 15px
  .app-description
    margin-bottom: 10px
  .app-website-link
    display: block
    text-decoration: underline
    margin-bottom: 20px
  .app-download-button
    display: inline-block
  .app-team-member
    padding: 15px
    .image
      border-radius: 50%
      overflow: hidden
    .title
      margin-bottom: 10px
      font-size: 22px
  .app-team-member + .app-team-member
    border-top: 1px solid rgba(211, 214, 219, 0.5)
</style>
