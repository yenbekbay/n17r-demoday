<template>
  <div class="flipclock columns is-desktop">
    <flip-clock-segment
      class="column"
      v-ref:days-segment
      :value="display.days"
      unit="days">
    </flip-clock-segment>
    <flip-clock-segment
      class="column"
      v-ref:hours-segment
      :value="display.hours"
      unit="hours">
    </flip-clock-segment>
    <flip-clock-segment
      class="column"
      v-ref:minutes-segment
      :value="display.minutes"
      unit="minutes">
    </flip-clock-segment>
    <flip-clock-segment
      class="column"
      v-ref:seconds-segment
      :value="display.seconds"
      unit="seconds">
    </flip-clock-segment>
  </div>
</template>

<script>
import moment from 'moment';
import TweenMax from 'gsap/src/uncompressed/TweenMax';

import FlipClockSegment from './FlipClockSegment.vue';

export default {
  name: 'FlipClock',
  props: ['countdownDate'],
  components: {
    FlipClockSegment
  },
  data() {
    const currentDate = moment();
    const countdownDate = moment(this.countdownDate);
    const getUnitsLeft = (unit) => countdownDate.diff(currentDate, unit);

    const daysLeft = getUnitsLeft('days');
    const hoursLeft = getUnitsLeft('hours');
    const minutesLeft = getUnitsLeft('minutes');
    const secondsLeft = getUnitsLeft('seconds');

    return {
      display: {
        days: daysLeft,
        hours: hoursLeft - daysLeft * 24,
        minutes: minutesLeft - hoursLeft * 60,
        seconds: secondsLeft - minutesLeft * 60
      },
      countdown: secondsLeft
    }
  },
  ready() {
    let countdownInterval = null;

    const updateValue = (unit) => {
      const value = Math.max(0, this.display[unit]);

      const $segment = this.$refs[`${unit}Segment`];
      const leaves = $segment.$children;
      const oldValues = leaves.map(leave => leave.frontValue);
      const newValues = String(value)
        .split('')
        .map(el => parseInt(el, 10));

      if (value >= 10) {
        // Animate only if the figure has changed
        if (oldValues[0] !== newValues[0]) {
          leaves[0].setValue(newValues[0]);
        }
        if (oldValues[1] !== newValues[1]) {
          leaves[1].setValue(newValues[1]);
        }
      } else {
        // If we are under 10, replace first figure with 0
        if (oldValues[0] !== 0) {
          leaves[0].setValue(0);
        }
        if (oldValues[1] !== newValues[0]) {
          leaves[1].setValue(newValues[0]);
        }
      }
    };

    countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        --this.display.seconds;

        if (this.display.minutes >= 0 && this.display.seconds < 0) {
          this.display.seconds = 59;
          --this.display.minutes;
        }

        if (this.display.hours >= 0 && this.display.minutes < 0) {
          this.display.minutes = 59;
          --this.display.hours;
        }

        if (this.display.days >= 0 && this.display.hours < 0) {
          this.display.hours = 23;
          --this.display.days;
        }

        updateValue('days');
        updateValue('hours');
        updateValue('minutes');
        updateValue('seconds');

        --this.countdown;
      } else {
        clearInterval(countdownInterval);
      }
    }, 1000);
  }
}
</script>

<style lang="stylus">
.flipclock
  justify-content: center
  .column
    flex: none
</style>
