<template>
  <div class="flip-leave">
    <span v-el:top-front class="top-front">{{ frontValue }}</span>
    <span v-el:top-back class="top-back"><span>{{ backValue }}</span></span>
    <span v-el:bottom-front class="bottom-front">{{ frontValue }}</span>
    <span v-el:bottom-back class="bottom-back"><span>{{ backValue }}</span></span>
  </div>
</template>

<script>
export default {
  name: 'FlipClockLeave',
  data() {
    return {
      frontValue: 0,
      backValue: 0
    }
  },
  methods: {
    setValue(value) {
      const $topFront = this.$els.topFront;
      const $topBack = this.$els.topBack;

      this.backValue = value;

      TweenMax.to($topFront, 0.8, {
        rotationX: '-180deg',
        transformPerspective: 300,
        ease: Quart.easeOut,
        onComplete: () => {
          this.frontValue = value;

          TweenMax.set($topFront, { rotationX: 0 });
        }
      });

      TweenMax.to($topBack, 0.8, {
        rotationX: 0,
        transformPerspective: 300,
        ease: Quart.easeOut,
        clearProps: 'all'
      });
    }
  }
}
</script>

<style lang="stylus">
.flip-leave
  background-color: #222324
  border-radius: 8px
  float: left
  height: 110px
  margin-right: 10px
  position: relative
  width: 80px
  &:last-child
    margin-right: 0
  > span
    position: absolute
    left: 0
    right: 0
    margin: auto
    font-size: 5.94em
    line-height: 107px
    font-weight: 700
    color: #fff
  .top-front, .bottom-back
    &:after
      content: ""
      position: absolute
      z-index: -1
      left: 0
      bottom: 0
      width: 100%
      height: 100%
  .top-front
    z-index: 3
    background-color: #191a1a
    transform-origin: 50% 100%
    border-radius: 10px 10px 0 0
    transform: perspective(200px)
    color: #e5e5e5
  .bottom-front
    z-index: 1
    &:before
      content: ""
      position: absolute
      display: block
      top: 0
      left: 0
      width: 100%
      height: 50%
      background-color: rgba(0, 0, 0, .02)
  .bottom-back
    z-index: 2
    top: 0
    height: 50%
    overflow: hidden
    background-color: #191a1a
    border-radius: 10px 10px 0 0
    color: #e5e5e5
    span
      position: absolute
      top: 0
      left: 0
      right: 0
      margin: auto
  .top-front, .top-back
    height: 50%
    overflow: hidden
    backface-visibility: hidden
  .top-back
    z-index: 4
    bottom: 0
    background-color: #222324
    transform-origin: 50% 0
    transform: perspective(200px) rotateX(180deg)
    border-radius: 0 0 10px 10px
    span
      position: absolute
      top: -100%
      left: 0
      right: 0
      margin: auto
</style>
