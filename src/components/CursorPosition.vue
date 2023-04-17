<template>
  <div class="cursor-position">
    <div class="fixed-bottom">
      {{ this.lat }}
      <br />
      {{ this.lng }}
    </div>
  </div>
</template>

<script>
export default {
  name: "CursorPosition",
  props: ["lat", "lng"],
};
</script>

<style>
.cursor-position {
  background: rgba(255, 255, 255, 0.5);
  z-index: 2;
}
</style>
