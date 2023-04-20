<template>
  <div class="map-wrap">
    <div class="map" ref="mapContainer" @mousemove="updateLatLng">
      <!-- Navigation buttons -->
      <div class="test"></div>
      <div class="navButtons">
        <div class="fixed-bottom">
          <button
            @click="
              this.toggleSidebar();
              this.setPanelTitle($event);
            "
            type="button"
            class="btn btn-primary"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
          >
            Settings
          </button>
          <button
            @click="
              this.toggleSidebar();
              this.setPanelTitle($event);
            "
            type="button"
            class="btn btn-primary"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
          >
            Filter
          </button>
          <button
            @click="
              this.toggleSidebar();
              this.setPanelTitle($event);
            "
            type="button"
            class="btn btn-primary"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
          >
            Statistics
          </button>
          <button
            @click="
              toggleSidebar();
              setPanelTitle($event);
            "
            type="button"
            class="btn btn-primary"
          >
            Analysis
          </button>
          <div class="cursor-position">Lat: -, Lng: -</div>
        </div>
      </div>

      <!-- <div
        class="offcanvas offcanvas-start"
        tabindex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <LeftPanel :title="this.panelTitle" />
      </div> -->
      <div id="left" class="sidebar flex-center left collapsed">
        <div class="sidebar-content rounded-rect flex-center">
          <LeftPanel :title="this.panelTitle" />
          <!-- <div class="sidebar-toggle rounded-rect right" @click="toggleSidebar">
            &rarr;
          </div> -->
        </div>
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
      console.log(event);
      this.panelTitle = event.srcElement.innerHTML;
      console.log(this.panelTitle);
    },
    // Source code for sidebar https://docs.mapbox.com/mapbox-gl-js/example/offset-vanishing-point-with-padding/
    toggleSidebar() {
      const elem = document.getElementById("left");
      // Add or remove the 'collapsed' CSS class from the sidebar element.
      // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
      const collapsed = elem.classList.toggle("collapsed");
      const padding = {};
      // 'id' is 'right' or 'left'. When run at start, this object looks like: '{left: 300}';
      padding["left"] = collapsed ? 0 : 300; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
      // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
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

.rounded-rect {
  z-index: 2;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 50px -25px black;
}

.flex-center {
  z-index: 2;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-center.left {
  z-index: 2;
  left: 0px;
}

.sidebar-content {
  z-index: 2;
  position: absolute;
  width: 95%;
  height: 95%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 32px;
  color: gray;
}

.sidebar-toggle {
  z-index: 2;
  position: absolute;
  width: 1.3em;
  height: 1.3em;
  overflow: visible;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sidebar-toggle.left {
  z-index: 2;
  right: -1.5em;
}

.sidebar-toggle:hover {
  z-index: 2;
  color: #0aa1cf;
  cursor: pointer;
}

.sidebar {
  z-index: 2;
  transition: transform 1s;
  z-index: 3;
  width: 300px;
  height: 100%;
}

/*
The sidebar styling has them "expanded" by default, we use CSS transforms to push them offscreen
The toggleSidebar() function removes this class from the element in order to expand it.
*/
.left.collapsed {
  transform: translateX(-295px);
}
</style>
