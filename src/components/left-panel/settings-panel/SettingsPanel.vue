<template>
  <div class="settings-content">
    <BasemapsPanel />
  </div>
  <div class="settings-content">
    <ClusterPanel />
  </div>
</template>

<script>
import BasemapsPanel from "./content/Basemaps.vue";
import ClusterPanel from "./content/Cluster.vue";

export default {
  name: "SettingsPanel",
  components: {
    BasemapsPanel,
    ClusterPanel,
  },
  methods: {
    consoloLog() {
      console.log("hallö");
    },
  },
};
</script>

<style></style>
