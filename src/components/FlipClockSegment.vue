<template>
  <div class="flip-segment">
    <div class="flip-leaves">
      <flip-clock-leave></flip-clock-leave>
      <flip-clock-leave></flip-clock-leave>
    </div>
    <h4 class="title">{{ formattedUnit }}</h4>
  </div>
</template>

<script>
import plural from 'plural-ru';

import FlipClockLeave from './FlipClockLeave.vue';

export default {
  name: 'FlipClockSegment',
  props: ['unit', 'value'],
  computed: {
    formattedUnit() {
      switch (this.unit) {
        case 'days':
          return plural(this.value, 'день', 'дня', 'дней');
        case 'hours':
          return plural(this.value, 'час', 'часа', 'часов');
        case 'minutes':
          return plural(this.value, 'минута', 'минуты', 'минут');
        case 'seconds':
          return plural(this.value, 'секунда', 'секунды', 'cекунд');
        default:
          return ''
      }
    }
  },
  components: {
    FlipClockLeave
  }
}
</script>

<style lang="stylus">
.flip-segment
  padding: 20px
  align-items: center
  display: flex
  flex-direction: column
  text-align: center
  .title
    margin: 10px 0 0 0
    font-size: 18px
  .flip-leaves
    display: flex
</style>
