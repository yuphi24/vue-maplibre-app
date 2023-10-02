<script setup>
import { SimpleBar } from "simplebar-vue3";

import { defineEmits, defineProps, ref, watch } from "vue";

import SettingsPanel from "./settings-panel/SettingsPanel.vue";
import FilterPanal from "./filter-panel/FilterPanal.vue";
import StatisticsPanal from "./statistics-panel/StatisticsPanal.vue";
import AnalysisPanal from "./analysis-panel/AnalysisPanal.vue";
import { Map } from "maplibre-gl";

const props = defineProps({
  title: String,
  map: Map,
  activeBaseLayer: String,
  heatFlowSchema: Object,
});
const heatFlowSchema = ref(props.heatFlowSchema);

watch(props, (newProps) => {
  heatFlowSchema.value = newProps.heatFlowSchema;
  // console.log("--------Yes Leftpanel-------");
  // console.log(heatFlowSchema.value);
});

const emit = defineEmits([
  "collapse-event",
  "toggle-event",
  "handle-legend-event",
]);
const handleLegendEvent = (legend) => {
  emit("handle-legend-event", legend);
};
</script>

<template>
  <div class="sidebar-header">
    <h3 v-if="props.title" class="sidebar-title" id="sidebarTitle">
      {{ props.title }}
    </h3>
    <button
      type="button"
      class="btn-close btn-close-white pull-right"
      data-bs-dismiss="sidebar"
      aria-label="Close"
      @click="$emit('collapse-event'), $emit('toggle-event')"
    ></button>
    <div style="clear: both"></div>
  </div>

  <SimpleBar style="height: 95%; padding-bottom: 10px; overflow-y: auto">
    <div class="sidebar-body">
      <SettingsPanel
        v-if="props.title === 'Settings'"
        :map="props.map"
        :activeBaseLayer="props.activeBaseLayer"
        :heatFlowSchema="heatFlowSchema"
        @handle-legend-event="handleLegendEvent"
      />
      <FilterPanal
        v-if="props.title === 'Filter'"
        :map="props.map"
        :heatFlowSchema="heatFlowSchema"
      />
      <StatisticsPanal v-if="props.title === 'Statistics'" />
      <AnalysisPanal v-if="props.title === 'Analysis'" />
    </div>
  </SimpleBar>
</template>

<style scoped>
.sidebar-header {
  background-color: #304b9b;
  border-bottom: 0.2rem solid #8eb7e2;
}

.sidebar-title {
  display: inline-block;
  color: #8eb7e2;
  font-weight: bold;
  padding-top: 10px;
  padding-bottom: 5px;
  padding-left: 15px;
}

.btn-close {
  float: right;
  color: #8eb7e2;
  display: inline-block;
  margin-top: 15px;
  margin-right: 15px;
}

.sidebar-body {
  background-color: lightgray;
  padding: 5px;
}
</style>
