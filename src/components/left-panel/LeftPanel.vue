<script setup>
import { defineProps } from "vue";

import SettingsPanel from "./settings-panel/SettingsPanel.vue";
import FilterPanal from "./filter-panel/FilterPanal.vue";
import StatisticsPanal from "./statistics-panel/StatisticsPanal.vue";
import AnalysisPanal from "./analysis-panel/AnalysisPanal.vue";

const props = defineProps(["title", "map", "activeBaseLayer"]);
</script>

<template>
  <div class="sidebar-content">
    <div class="sidebar-header">
      <h3 class="sidebar-title" id="sidebarTitle">{{ this.title }}</h3>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="sidebar"
        aria-label="Close"
      ></button>
    </div>

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
  </div>
</template>

<style>
.sidebar-content {
  overflow-y: auto;
}
</style>
