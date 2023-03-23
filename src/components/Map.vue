<template>
  <div class="map-wrap">
    <div class="map" ref="mapContainer">
      <!-- Navigation buttons -->
      <div class="navButtons">
        <button
          @click="setPanelTitle"
          type="button"
          class="btn btn-primary"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
        >
          Settings
        </button>
        <button
          @click="setPanelTitle"
          type="button"
          class="btn btn-primary"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
        >
          Filter
        </button>
        <button
          @click="setPanelTitle"
          type="button"
          class="btn btn-primary"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
        >
          Statistics
        </button>
        <button
          @click="setPanelTitle"
          type="button"
          class="btn btn-primary"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
        >
          Analysis
        </button>
      </div>

      <div
        class="offcanvas offcanvas-start"
        tabindex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <LeftPanel :title="this.panelTitle" />
      </div>
    </div>
  </div>
</template>

<script>
import { FullscreenControl, Map, NavigationControl } from "maplibre-gl";
import { shallowRef, onMounted, onUnmounted, markRaw } from "vue";

import LeftPanel from "./left-panel/LeftPanel.vue";

export default {
  name: "MapComponent",
  data() {
    return {
      panelTitle: "default",
    };
  },
  components: {
    LeftPanel,
  },
  methods: {
    setPanelTitle(event) {
      this.panelTitle = event.srcElement.innerHTML;
    },
  },
  setup() {
    const mapContainer = shallowRef(null);
    const map = shallowRef(null);

    onMounted(() => {
      map.value = markRaw(
        new Map({
          mapId: "map_1",
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

      map.value.addControl(new FullscreenControl(), "top-right");
      map.value.addControl(new NavigationControl(), "top-right");
      // console.log(map.value.scrollZoom.isEnabled());
    }),
      onUnmounted(() => {
        map.value?.remove();
      });

    console.log(map);

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

.btn {
  z-index: 2;
}
</style>
