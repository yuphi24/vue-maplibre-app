<template>
  <div class="mapStyle">
    <h3>Map Style</h3>
  </div>
  <div class="cluster">
    <h3>Cluster</h3>
    <input
      type="checkbox"
      class="btn-check"
      id="btn-check-outlined"
      autocomplete="off"
    />
    <label class="btn btn-outline-primary" for="btn-check-outlined">Off</label
    ><br />
  </div>
</template>

<script>
export default {
  name: "SettingsPanel",
};
</script>

<style></style>
