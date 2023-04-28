<script>
import BaseMapSettings from "./content/BaseMapSettings.vue";
import ClusterSettings from "./content/ClusterSettings.vue";
import CircleStylingSettings from "./content/CircleStylingSettings.vue";
import GraticuleSettings from "./content/GraticuleSettings.vue";

export default {
  name: "SettingsPanel",
  components: {
    BaseMapSettings,
    ClusterSettings,
    CircleStylingSettings,
    GraticuleSettings,
  },
  methods: {
    consoloLog() {
      console.log("hallö");
    },
  },
};
</script>

<template>
  <div class="settings-content">
    <BaseMapSettings />
  </div>
  <div class="settings-content">
    <ClusterSettings />
  </div>
  <div class="settings-content">
    <CircleStylingSettings />
  </div>
  <div class="settings-content">
    <GraticuleSettings />
  </div>
</template>

<style>
.settings-content {
  display: block;
  padding: 2px;
  margin: 2px;
  border-top: 4px inset;
  overflow: auto;
}
</style>
