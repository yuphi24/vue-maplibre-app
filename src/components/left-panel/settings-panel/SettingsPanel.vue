<template>
  <aside class="settings-panel">
    <div class="settings">
      <h1 class="settings-title">
        <span>
          Settings
          <i class="icofont-cart-alt icofont-1x"></i>
        </span>
        <button @click="toggleSet" class="cart-close">&times;</button>
      </h1>

      <div class="settings-body"></div>
    </div>
  </aside>
</template>

<script>
export default {
  name: "SettingsPanel",
  props: ["toggleSet"],
};
</script>

<style>
.settings-panel {
  z-index: 1;
}
</style>
