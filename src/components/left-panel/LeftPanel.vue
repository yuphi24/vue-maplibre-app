<script setup>
import { SimpleBar } from "simplebar-vue3";

import { defineEmits, defineProps } from "vue";

import SettingsPanel from "./settings-panel/SettingsPanel.vue";
import FilterPanal from "./filter-panel/FilterPanal.vue";
import StatisticsPanal from "./statistics-panel/StatisticsPanal.vue";
import AnalysisPanal from "./analysis-panel/AnalysisPanal.vue";
import { Map } from "maplibre-gl";

const props = defineProps({
  title: String,
  map: Map,
  activeBaseLayer: String,
  isCollapsed: Boolean,
});

const emit = defineEmits(["collapse-event"]);
const sendCollapseEvent = () => emit("collapse-event");

function toggleSidebar() {
  const elem = document.getElementById("left-panel");
  // Add or remove the 'collapsed' CSS class from the sidebar element.
  // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
  const collapsed = elem.classList.toggle("collapsed");
  // this.$emit("");
  console.log(collapsed);
  const padding = {};
  // 'id' is 'right' or 'left'. When run at start, this object looks like: '{left: 300}';
  padding["left-panel"] = collapsed ? 0 : 300; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
  // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
}
</script>

<template>
  <div class="sidebar-header">
    <h3 class="sidebar-title" id="sidebarTitle">{{ this.title }}</h3>
    <button
      type="button"
      class="btn-close btn-close-white pull-right"
      data-bs-dismiss="sidebar"
      aria-label="Close"
      @click="toggleSidebar"
      @click.prevent="sendCollapseEvent"
    ></button>
    <div style="clear: both"></div>
  </div>

  <SimpleBar style="height: 95%; padding-bottom: 10px; overflow-y: auto">
    <div class="sidebar-body">
      <SettingsPanel
        v-if="props.title === 'Settings'"
        :map="props.map"
        :activeBaseLayer="props.activeBaseLayer"
      />
      <FilterPanal v-if="props.title === 'Filter'" />
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
