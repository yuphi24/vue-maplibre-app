<script setup>
import { defineProps, ref, watch } from "vue";

import BaseMapSettings from "./BaseMapSettings.vue";
// import ClusterSettings from "./content/ClusterSettings.vue";
import CircleStylingSettings from "./CircleStylingSettings.vue";
import { Map } from "maplibre-gl";
// import GraticuleSettings from "./content/GraticuleSettings.vue";

const props = defineProps({
  map: Map,
  activeBaseLayer: String,
  heatFlowSchema: Object,
});
const heatFlowSchema = ref(props.heatFlowSchema);

watch(props, (newProps) => {
  heatFlowSchema.value = newProps.heatFlowSchema;

  console.log("--------Settings");
  console.log(heatFlowSchema.value);
});
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
    <CircleStylingSettings :map="props.map" :heatFlowSchema="heatFlowSchema" />
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
