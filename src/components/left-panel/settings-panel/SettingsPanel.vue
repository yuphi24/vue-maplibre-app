<script setup>
import { defineProps } from "vue";

import BaseMapSettings from "./content/BaseMapSettings.vue";
// import ClusterSettings from "./content/ClusterSettings.vue";
import CircleStylingSettings from "./content/CircleStylingSettings.vue";
// import GraticuleSettings from "./content/GraticuleSettings.vue";

const props = defineProps(["map", "activeBaseLayer"]);
</script>

<template>
  <div class="settings-content">
    <BaseMapSettings
      :map="props.map"
      :activeBaseLayer="props.activeBaseLayer"
    />
  </div>
  <!-- <div class="settings-content">
    <ClusterSettings />
  </div> -->
  <div class="settings-content">
    <CircleStylingSettings :map="props.map" />
  </div>
  <!-- <div class="settings-content">
    <GraticuleSettings />
  </div> -->
</template>

<style scoped>
.settings-content {
  display: block;
  padding: 2px;
  margin: 2px;
  border-top: 4px inset;
  overflow: auto;
}
</style>
