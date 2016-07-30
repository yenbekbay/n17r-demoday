<template>
  <div class="submission">
    <h1 class="title has-text-centered">{{ title }}</h1>
    <div class="columns">
      <div class="column is-6 is-offset-3">
        <pulse-loader :class="'has-text-centered'" :loading="loading" :color="'#1fc8db'"></pulse-loader>
        <div v-show="!loading">
          <label class="label" for="title-input">Title</label>
          <p class="control">
            <text-input
              :value.sync="app.title"
              id="title-input"
              placeholder="App title"
            >
          </p>
          <label class="label" for="description-input">Description (1 sentence)</label>
          <p class="control">
            <text-input
              :multiline="true"
              :value.sync="app.description"
              id="description-input"
              placeholder="App description"
            >
          </p>
          <label class="label" for="website-input">Website URL</label>
          <p class="control">
            <text-input
              :value.sync="app.websiteUrl"
              :validate="validateWebsite"
              id="website-input"
              placeholder="App website URL"
            >
          </p>
          <label class="label" for="app-store-id-input">App Store ID (e.g. 123456789)</label>
          <p class="control">
            <text-input
              :value.sync="app.appStoreId"
              id="app-store-id-input"
              placeholder="App Store ID"
            >
          </p>
          <label class="label" for="google-play-id-input">Google Play package name (e.g. com.example.app)</label>
          <p class="control">
            <text-input
              :value.sync="app.googlePlayId"
              id="google-play-id-input"
              placeholder="Google Play package name"
            >
          </p>
          <label class="label">Icon (.jpg)</label>
          <div class="control">
            <image-input
              :file.sync="app.iconFile"
              :image-url.sync="app.iconUrl"
              :image-color.sync="app.iconColor"
              :max-size="512"
            >
          </div>
          <label class="label">Team members</label>
          <div class="team-input-container">
            <template v-for="(idx, teamMember) in app.teamMembers">
              <team-member-input
                :team-member.sync="teamMember"
                :on-remove="() => removeTeamMember(idx)"
              >
            </template>
            <a class="button is-fullwidth" v-on:click="addTeamMember">Add another member</a>
          </div>
          <a
            class="button is-primary is-fullwidth"
            v-on:click="save"
            :class="{'is-loading': saving}"
          >Save</a>
        </div>
        <br>
        <div class="notification is-danger" v-show="error">{{ error }}</div>
        <div class="notification is-success" v-show="successMessage">{{ successMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

import ImageInput from './ImageInput.vue';
import store from '../store';
import TeamMemberInput from './TeamMemberInput.vue';
import TextInput from './TextInput.vue';

export default {
  name: 'EditEntryView',
  components: {
    PulseLoader,
    ImageInput,
    TextInput,
    TeamMemberInput
  },
  data() {
    return {
      title: 'Demo Day submission',
      app: {
        title: '',
        description: '',
        websiteUrl: '',
        appStoreId: '',
        googlePlayId: '',
        iconFile: '',
        iconUrl: '',
        iconColor: '',
        teamMembers: [{
          name: '',
          bio: '',
          photoFile: '',
          photoUrl: ''
        }]
      },
      appId: null,
      loading: true,
      saving: false,
      error: null,
      successMessage: null
    };
  },
  route: {
    data({ to: { path, params: { appId } } }) {
      if (path === '/submission/new') {
        return {
          title: 'Add a new app',
          loading: false
        };
      }

      if (appId) {
        return store
          .getAppById(appId)
          .then(app => ({
            title: 'Edit an app',
            app: _.assign(this.app, app),
            appId,
            loading: false
          }));
      }

      return {};
    }
  },
  methods: {
    validateWebsite(text) {
      if (text.length >= 7 && !text.match(/https?:\/\//)) {
        return 'Please provide a valid URL (e.g. http://example.com)';
      }

      return null;
    },
    addTeamMember() {
      this.app.teamMembers.push({
        name: '',
        bio: '',
        photoFile: '',
        photoUrl: ''
      });
    },
    removeTeamMember(idx) {
      this.app.teamMembers.splice(idx, 1);
      if (!this.app.teamMembers.length) {
        this.addTeamMember();
      }
    },
    save() {
      const {
        title,
        description,
        websiteUrl,
        iconFile,
        iconUrl,
        teamMembers
      } = this.app;
      const validateForm = () => {
        if (!title || !description || !websiteUrl || (!iconFile && !iconUrl)) {
          return false;
        }

        for (const teamMember of teamMembers) {
          if (!teamMember.name || !teamMember.bio ||
            (!teamMember.photoFile && !teamMember.photoUrl)
          ) {
            return false;
          }
        }

        return true;
      };

      this.successMessage = null;

      if (!validateForm()) {
        this.error = 'Please complete the form';
      } else {
        this.error = null;
        this.saving = true;

        store
          .saveApp(this.app, this.appId)
          .then(
            () => {
              if (this.appId) {
                this.successMessage = 'Thank you! Your changes have been saved.';
              } else {
                this.$route.router.go('/submission/list?created=true');
              }

              this.saving = false;
            },
            err => {
              this.error = err;
              this.saving = false;
            }
          );
      }
    }
  },
  watch: {
    title(title) {
      document.title = title;
    }
  }
};
</script>

<style lang="stylus">
.team-input-container
  border: 1px solid #d3d6db
  border-radius: 3px
  padding: 10px
.button
  margin-top: 10px
</style>
