<template>
  <div class="media">
    <div class="media-left">
      <image-input
        :file.sync="teamMember.photoFile"
        :image-url.sync="teamMember.photoUrl"
        :max-size="256"
      >
    </div>
    <div class="media-content">
      <p class="control">
        <text-input
          :required="true"
          :value.sync="teamMember.name"
          id="name-input"
          placeholder="Member name"
        >
      </p>
      <p class="control">
        <text-input
          :required="true"
          :multiline="true"
          :value.sync="teamMember.bio"
          :validate="validateBio"
          id="bio-input"
          placeholder="Member biography"
        >
      </p>
    </div>
    <div class="media-right">
      <button class="delete" v-on:click="onRemove"></button>
    </div>
  </div>
</template>

<script>
import ImageInput from './ImageInput.vue';
import TextInput from './TextInput.vue';

export default {
  name: 'TeamMemberInput',
  props: ['teamMember', 'onRemove'],
  components: {
    ImageInput,
    TextInput
  },
  methods: {
    validateBio(text) {
      if (text.length > 300) {
        return 'Please keep the description length up to 300 characters';
      }

      return null;
    },
  }
};
</script>

<style lang="stylus" scoped>
.media-left
  width: 128px
</style>
