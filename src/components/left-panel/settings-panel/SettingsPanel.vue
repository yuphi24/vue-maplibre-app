<script setup>
import { defineEmits, defineProps, ref, watch } from "vue";

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

const emit = defineEmits(["handle-legend-event"]);
const handleLegendEvent = (legend) => {
  emit("handle-legend-event", legend);
};

watch(props, (newProps) => {
  heatFlowSchema.value = newProps.heatFlowSchema;

  console.log("--------Settings");
  console.log(heatFlowSchema.value);
});
</script>

<template>
  <div class="overflow-auto px-1 pt-1 pb-1">
    <BaseMapSettings
      :map="props.map"
      :activeBaseLayer="props.activeBaseLayer"
    />

    <!-- <ClusterSettings /> -->

    <CircleStylingSettings :map="props.map" @send-legend="handleLegendEvent" />

    <!-- <GraticuleSettings /> -->
  </div>
</template>

<style scoped></style>
