<template>
  <div>
    <section class="hero is-dark is-fullheight">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">nFactorial Incubator Demo Day</h1>
          <h3 class="subtitle">У каждого начала должен быть конец</h3>
          <flip-clock :countdown-date="countdownDate"></flip-clock>
          <a class="button is-large is-outlined" href="http://bit.ly/n17r-demoday">Принять участие</a>
        </div>
      </div>
    </section>
    <section class="section app-content">
      <div class="container">
        <div class="columns">
          <div class="column is-10 is-offset-1">
            <div class="notification is-danger" v-show="error">{{ error }}</div>
            <div class="notification is-warning" v-show="!loading && !apps.length">Пока ничего нет – зайдите чуть позже</div>
            <pulse-loader :class="'has-text-centered'" :loading="loading" :color="'#1fc8db'"></pulse-loader>
            <div class="app-cards">
              <div class="app-card" v-for="app in apps" track-by="$index">
                <div class="app-info columns is-mobile" :style="{'background-color': app.iconColor}">
                  <div class="app-icon column is-4">
                    <figure class="image is-square">
                      <img
                        :src="app.iconUrl"
                        :style="{ 'border-radius': app.appStoreId ? '24%' : '0' }"
                      >
                    </figure>
                  </div>
                  <div class="app-text column">
                    <a class="app-title" :href="app.websiteUrl">
                      <h2 class="title" :style="{'color': app.textColor}">
                        {{ app.title }}
                      </h2>
                    </a>
                    <p class="app-description" :style="{'color': app.textColor}">
                      {{{ app.description | formatNewlines }}}
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
                      <p>{{{ teamMember.bio | formatNewlines }}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import _ from 'lodash';
import Macy from 'macy';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

import FlipClock from './FlipClock.vue';
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
    PulseLoader,
    FlipClock
  },
  data() {
    return {
      apps: [],
      loading: true,
      error: null,
      countdownDate: new Date(2016, 7, 13, 10, 0)
    }
  },
  ready() {
    store
      .getApps()
      .then(apps => {
        this.apps = apps.map(app => _.assign(app, {
          textColor: (app.iconColor && app.iconColor !== 'rgb()')
            ? getNormalizedTextColor(app.iconColor)
            : '#f5f7fa',
          cleanWebsiteUrl: _.nth(
            app.websiteUrl.match(/https?:\/\/(?:www)?\.?(.*)/),
            1
          )
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
  },
  filters: {
    formatNewlines(text) {
      return text.replace(/\n/g, '<br>');
    }
  }
};
</script>

<style lang="stylus">
.hero
  background: url(/demoday-backdrop.jpg) center center no-repeat rgba(0,0,0,.5)
  background-size: cover
.hero-body
  .container
    padding: 80px 0
    flex-direction: column
    justify-content: center
  .title
    font-size: 50px
    margin-bottom: 25px
  .title, .subtitle
    font-weight: 400
  .flipclock
    margin-top: 20px
  .button
    background: 0 0
    color: #fff
    &:hover, &:active
      color: #000
      background-color: #fff
      border-color: #fff

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
      img
        object-fit: cover
    .title
      margin-bottom: 10px
      font-size: 22px
  .app-team-member + .app-team-member
    border-top: 1px solid rgba(211, 214, 219, 0.5)
</style>
