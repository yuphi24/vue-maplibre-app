<template>
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasTitle">{{ this.title }}</h5>
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    ></button>
  </div>

  <div class="offcanvas-body">
    <SettingsPanel v-if="this.title === ' Settings '" />
    <FilterPanal v-if="this.title === ' Filter '" />
    <StatisticsPanal v-if="this.title === ' Statistics '" />
    <AnalysisPanal v-if="this.title === ' Analysis '" />
  </div>
</template>

<script>
import SettingsPanel from "./settings-panel/SettingsPanel.vue";
import FilterPanal from "./filter-panel/FilterPanal.vue";
import StatisticsPanal from "./statistics-panel/StatisticsPanal.vue";
import AnalysisPanal from "./analysis-panel/AnalysisPanal.vue";

export default {
  name: "LeftPanel",
  props: ["title"],
  data() {
    return {
      a: "hallö",
    };
  },
  components: {
    SettingsPanel,
    FilterPanal,
    StatisticsPanal,
    AnalysisPanal,
  },
  methods: {
    isTitle() {
      console.log(" Settings " == this.title);
    },
  },
};
</script>

<style></style>
