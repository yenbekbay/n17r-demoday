<template>
  <textarea
    v-if="multiline"
    v-model="value"
    class="textarea"
    :class="{'is-danger': error}"
    :id="id"
    :placeholder="placeholder">
  </textarea>
  <input
    v-else
    v-model="value"
    class="input"
    type="text"
    :class="{'is-danger': error}"
    :id="id"
    :placeholder="placeholder"
  >
  <span v-show="error" class="help is-danger">{{ error }}</span>
</template>

<script>
export default {
  name: 'TextInput',
  props: ['value', 'id', 'multiline', 'placeholder', 'validate'],
  data() {
    return {
      error: ''
    };
  },
  watch: {
    value(value) {
      if (!this.validate) return;

      this.error = this.validate(value);
    }
  }
};
</script>
