<template>
  <div
    v-if="!imageSource && !imageUrl"
    class="dropzone-area"
    drag-over="handleDragOver"
    v-on:dragenter="hovering = true"
    v-on:dragleave="hovering = false"
    :class="{'hovered': hovering}"
  >
    <div><h1 class="subtitle">Drop image here or click to select</h1></div>
    <input type="file" v-on:change="onFileChange">
  </div>
  <div v-else class="dropzone-preview">
    <figure>
      <img :src="imageSource || imageUrl">
      <button class="delete" v-on:click="removeImage"></button>
    </figure>
  </div>
</template>

<script>
import 'rgbaster.js';

const dataUrlToFile = (dataURL, filename) => {
  let byteString;
  if (dataURL.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataURL.split(',')[1]);
  } else {
    byteString = unescape(dataURL.split(',')[1]);
  }

  let bytes = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    bytes[i] = byteString.charCodeAt(i);
  }

  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

  const blob = new Blob([bytes], {
    type: mimeString
  });

  blob.lastModifiedDate = new Date();
  blob.name = filename;

  return blob;
}

export default {
  name: 'ImageInput',
  props: ['file', 'imageUrl', 'imageColor', 'maxSize'],
  data() {
    return {
      imageSource: '',
      hovering: false
    };
  },
  methods: {
    onFileChange({ target, dataTransfer }) {
      const files = target.files || dataTransfer.files;
      if (!files.length) return;

      this.hovering = false;
      this.setImage(files[0]);
    },
    setImage(file) {
      const reader = new FileReader();

      reader.onload = ({ target: { result } }) => {
        const image = new Image();
        const extension = result.match(/^data:(.*);/)[1];

        image.onload = () => {
          const canvas = document.createElement('canvas');
          let width = image.width;
          let height = image.height;

          if (width > height) {
            if (width > this.maxSize) {
              height *= this.maxSize / width;
              width = this.maxSize;
            }
          } else {
            if (height > this.maxSize) {
              width *= this.maxSize / height;
              height = this.maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(image, 0, 0, width, height);

          this.imageSource = canvas.toDataURL(extension);

          this.file = dataUrlToFile(
            this.imageSource,
            file.name.replace(
              /(.+)\.([^\.]+)/,
              `$1-${new Date().getTime()}.$2`
            )
          );

          RGBaster.colors(image, {
            paletteSize: 20,
            exclude: ['rgb(0,0,0)', 'rgb(255,255,255)'],
            success: payload => {
              this.imageColor = payload.dominant;
            }
          })
        };
        image.src = result;
      };
      reader.readAsDataURL(file);
    },
    removeImage() {
      this.imageSource = '';
      this.imageUrl = '';
    }
  }
};
</script>

<style lang="stylus">
.dropzone-area
  align-items: center
  border: 2px dashed #d3d6db
  display: flex
  height: 128px
  justify-content: center
  padding: 10px
  position: relative
  &.hovered
    border: 2px dashed #1fc8db
    .subtitle
      color: #1fc8db
  input
    position: absolute
    cursor: pointer
    top: 0
    right: 0
    bottom: 0
    left: 0
    width: 100%
    height: 100%
    opacity: 0
.dropzone-preview
  display: inline-block
  img
    max-height: 128px
  figure
    position: relative
  button
    background: rgba(17, 17, 17, 0.5)
    border-radius: 0
    position: absolute
    top: 0
    right: 0
    &:hover
      background: rgba(17, 17, 17, 0.7)
</style>
