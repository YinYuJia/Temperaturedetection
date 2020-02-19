<template>
  <svg
    :class="getClassName"
    :width="width"
    :height="height"
    aria-hidden="true">
    <use :xlink:href="getName"></use>
  </svg>
</template>

<script>
  export default {
    name: 'icon-svg',
    props: {
      name: {
        type: String,
        required: true
      },
      className: {
        type: String
      },
      width: {
        type: String
      },
      height: {
        type: String
      }
    },
    computed: {
      getName () {
        return `#icon-${this.name}`
      },
      getClassName () {
        return [
          'icon-svg',
          `icon-svg__${this.name}`,
          this.className && /\S/.test(this.className) ? `${this.className}` : ''
        ]
      }
    }
  }
</script>

<style>
  .icon-svg {
    width: 33px;
    height: 33px;
    fill: #3E8EF7;
    overflow: hidden;
    margin-top: -3px;
  }
</style>
