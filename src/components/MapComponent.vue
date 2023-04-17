<template>
  <div class="map-wrap">
    <div class="map" ref="mapContainer" @mousemove="consolLog">
      <!-- Navigation buttons -->
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
      <div class="test123">
        <h1>{{ latCoord }}</h1>
      </div>
      <CursorPosition :lat="this.latCoord" :lng="this.lngCoord" />
    </div>
  </div>
</template>

<script>
import { FullscreenControl, Map, NavigationControl } from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { shallowRef, onMounted, onUnmounted, markRaw } from "vue";
import CursorPosition from "./CursorPosition.vue";

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
    CursorPosition,
  },
  methods: {
    setPanelTitle(event) {
      this.panelTitle = event.srcElement.innerHTML;
    },
  },
  setup() {
    const mapContainer = shallowRef(null);
    const map = shallowRef(null);
    let latCoord = "";
    let lngCoord = "";

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
      console.log("Here we are");
      console.log(map.value);
      console.log("now");

      map.value.on("mousemove", function (e) {
        latCoord = e.lngLat.wrap().lat;
        lngCoord = e.lngLat.wrap().lng;
        console.log("Here we are");
        console.log("now");
        console.log(latCoord + " " + lngCoord);
      });
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
  bottom: 5%;
}

.btn {
  z-index: 2;
}
</style>
