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
          :value.sync="teamMember.name"
          id="name-input"
          placeholder="Member name"
        >
      </p>
      <p class="control">
        <text-input
          :multiline="true"
          :value.sync="teamMember.bio"
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
  }
};
</script>

<style lang="stylus" scoped>
.media-left
  width: 128px
</style>
