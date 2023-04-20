<template>
  <div class="map-wrap" @mousemove="consoleLog">
    <div class="map" ref="mapContainer" @mousemove="updateLatLng">
      <!-- Navigation buttons -->
      <div class="test"></div>
      <div class="navButtons">
        <div class="fixed-bottom">
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
          <div class="cursor-position">Move Cursor</div>
        </div>
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
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { shallowRef, onMounted, onUnmounted, markRaw } from "vue";

import LeftPanel from "./left-panel/LeftPanel.vue";

export default {
  name: "MapComponent",
  data() {
    return {
      panelTitle: "default",
      latCoord: "",
      lngCoord: "",
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

      map.value.on("mousemove", function (e) {
        let latValue = "Lat: " + e.lngLat.wrap().lat.toFixed(5);
        let lngValue = "Lng: " + e.lngLat.wrap().lng.toFixed(5);
        document.getElementsByClassName("cursor-position")[0].innerHTML =
          latValue + ", " + lngValue;
      });

      map.value.addControl(new FullscreenControl(), "top-right");
      map.value.addControl(new NavigationControl(), "top-right");
      map.value.addControl(
        new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: true,
            line: true,
            trash: true,
          },
        })
      );
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
@import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

.map-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
}

.map {
  position: relative;
  width: 100%;
  height: 100%;
}

.navButtons {
  z-index: 2;
}

.fixed-bottom {
  position: absolute;
}

.cursor-position {
  display: block;
  position: relative;
  margin: 0px auto;
  width: fit-content;
  padding: 10px;
  border: none;
  border-radius: 3px;
  font-size: 10px;
  text-align: left;
  color: black;
  background: rgba(255, 255, 255, 0.5);
}

.btn {
  z-index: 2;
}

.control-icon {
  z-index: 2;
}

.cursor-coord-collapse {
  z-index: 2;
}

.cursor-position {
  background: rgba(255, 255, 255, 0.5);
  z-index: 2;
}

.test {
  z-index: 2;
}
</style>
