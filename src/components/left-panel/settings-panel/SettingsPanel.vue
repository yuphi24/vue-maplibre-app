<template>
  <div class="settings-content">
    <BasemapsPanel />
  </div>
  <div class="settings-content">
    <ClusterPanel />
  </div>
  <div class="settings-content">
    <CircleStyling />
  </div>
</template>

<script>
import BasemapsPanel from "./content/Basemaps.vue";
import ClusterPanel from "./content/Cluster.vue";
import CircleStyling from "./content/CircleStyling.vue";

export default {
  name: "SettingsPanel",
  components: {
    BasemapsPanel,
    ClusterPanel,
    CircleStyling,
  },
  methods: {
    consoloLog() {
      console.log("hallö");
    },
  },
};
</script>

<style>
.settings-content {
  display: block;
  padding: 2px;
  margin: 2px;
  border-top: 4px inset;
  overflow: auto;
}
</style>
