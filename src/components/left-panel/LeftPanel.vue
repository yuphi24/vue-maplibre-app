<script setup>
import { SimpleBar } from "simplebar-vue3";

import { defineProps } from "vue";

import SettingsPanel from "./settings-panel/SettingsPanel.vue";
import FilterPanal from "./filter-panel/FilterPanal.vue";
import StatisticsPanal from "./statistics-panel/StatisticsPanal.vue";
import AnalysisPanal from "./analysis-panel/AnalysisPanal.vue";

const props = defineProps(["title", "map", "activeBaseLayer"]);
</script>

<template>
  <div class="sidebar-header">
    <h3 class="sidebar-title" id="sidebarTitle">{{ this.title }}</h3>
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="sidebar"
      aria-label="Close"
    ></button>
    <div style="clear: both"></div>
  </div>

  <SimpleBar style="height: 95%; padding-bottom: 10px; overflow-y: auto">
    <div class="sidebar-body">
      <SettingsPanel
        v-if="props.title === ' Settings '"
        :map="props.map"
        :activeBaseLayer="props.activeBaseLayer"
      />
      <FilterPanal v-if="props.title === ' Filter '" />
      <StatisticsPanal v-if="props.title === ' Statistics '" />
      <AnalysisPanal v-if="props.title === ' Analysis '" />
    </div>
  </SimpleBar>
</template>

<style scoped>
.sidebar-header {
}

.sidebar-title {
  float: left;
  padding-top: 15px;
  padding-left: 15px;
}

.btn-close {
  float: right;
  margin-top: 15px;
  margin-right: 15px;
}
</style>
