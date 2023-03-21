<template>
  <div class="map-wrap">
    <div class="map" ref="mapContainer">
      <div class="navButtons">
        <button @click="toggleSettings" type="button" class="btn btn-primary">
          Settings
        </button>
        <button @click="toggleFilter" type="button" class="btn btn-primary">
          Filter
        </button>
        <button @click="toggleStatistics" type="button" class="btn btn-primary">
          Statistics
        </button>
        <button @click="toggleAnalysis" type="button" class="btn btn-primary">
          Analysis
        </button>
      </div>

      <SettingsPanel v-if="showSettingsPanel" :toggleSet="toggleSettings" />
      <FilterPanal v-if="showFilterPanel" :toggleFil="toggleFilter" />
      <StatisticsPanal
        v-if="showStatisticsPanel"
        :toggleStat="toggleStatistics"
      />
      <AnalysisPanal v-if="showAnalysisPanel" :toggleAna="toggleAnalysis" />
    </div>
  </div>
</template>

<script>
import { FullscreenControl, Map, NavigationControl } from "maplibre-gl";
import { shallowRef, onMounted, onUnmounted, markRaw } from "vue";
import SettingsPanel from "./left-panel/settings-panel/SettingsPanel.vue";
import FilterPanal from "./left-panel/filter-panel/FilterPanal.vue";
import StatisticsPanal from "./left-panel/statistics-panel/StatisticsPanal.vue";
import AnalysisPanal from "./left-panel/analysis-panel/AnalysisPanal.vue";

export default {
  name: "MapComponent",
  data() {
    return {
      showSettingsPanel: false,
      showFilterPanel: false,
      showStatisticsPanel: false,
      showAnalysisPanel: false,
    };
  },
  components: {
    SettingsPanel,
    FilterPanal,
    StatisticsPanal,
    AnalysisPanal,
  },
  methods: {
    toggleSettings() {
      this.showSettingsPanel = !this.showSettingsPanel;
    },
    toggleFilter() {
      this.showFilterPanel = !this.showFilterPanel;
    },
    toggleStatistics() {
      this.showStatisticsPanel = !this.showStatisticsPanel;
    },
    toggleAnalysis() {
      this.showAnalysisPanel = !this.showAnalysisPanel;
    },
  },
  setup() {
    const mapContainer = shallowRef(null);
    const map = shallowRef(null);

    onMounted(() => {
      map.value = markRaw(
        new Map({
          mapId: "whfd-map",
          container: mapContainer.value,
          attributionControl: true,
          style: {
            version: 8,
            sources: {
              osm: {
                type: "raster",
                tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
                tileSize: 256,
                attribution: "&copy; OpenStreetMap Contributors",
                minzoom: 0,
                maxzoom: 22,
              },
            },
            layers: [
              {
                id: "osm",
                type: "raster",
                source: "osm",
              },
            ],
            glyphs:
              "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf", // https://maplibre.org/maplibre-gl-js-docs/style-spec/glyphs/
          },
        })
      );

      // map.value.addControl(new FullscreenControl(), "top-right");
      // map.value.addControl(new NavigationControl(), "top-right");
      console.log(map.value.scrollZoom.isEnabled());
    }),
      onUnmounted(() => {
        map.value?.remove();
      });

    return {
      map,
      mapContainer,
    };
  },
};
</script>

<style scoped>
@import "~maplibre-gl/dist/maplibre-gl.css";

.map-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
}

.map {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.navButtons {
  position: absolute;
  bottom: 5%;
  margin-left: auto;
  margin-right: auto;
  z-index: 2;
}
</style>
