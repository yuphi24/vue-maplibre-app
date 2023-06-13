<script setup>
// vue
import { shallowRef, onMounted, onUnmounted, markRaw, ref } from "vue";

// map viewer
import {
  FullscreenControl,
  Map,
  NavigationControl,
  ScaleControl,
} from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

// data
import maps from "./left-panel/settings-panel/content/maps.json";
import sitesURL from "@/assets/data/small_sites.geojson";

// components
import LeftPanel from "./left-panel/LeftPanel.vue";

const mapContainer = shallowRef(null);
const map = shallowRef(null);
const navbarTitles = ref(["Settings", "Filter", "Statistics", "Analysis"]); // can be extend with custom buttons
const latCoord = ref();
const lngCoord = ref();
const panelTitle = ref("");
const basemaps = ref(maps);
const activeBaseLayer = ref("");
const sites = ref(sitesURL);
const defaultCircleColor = ref("#41b6c4");
const isCollapsed = ref(true);
const setIsCollapsedTrue = () => (isCollapsed.value = true);

// function consoleLog() {
//   console.log("hallö");
// }

// Source code for sidebar https://docs.mapbox.com/mapbox-gl-js/example/offset-vanishing-point-with-padding/
function toggleSidebar() {
  const elem = document.getElementById("left-panel");
  // Add or remove the 'collapsed' CSS class from the sidebar element.
  // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
  const collapsed = elem.classList.toggle("collapsed");
  console.log(collapsed);
  isCollapsed.value = collapsed;
  const padding = {};
  // 'id' is 'right' or 'left'. When run at start, this object looks like: '{left: 300}';
  padding["left-panel"] = collapsed ? 0 : 300; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
  // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
}

// get title of corresponding button and set it as title of sidepanel
function setPanelTitle(event) {
  panelTitle.value = event.srcElement.innerHTML;
}

// create object for base map sources
function setBaseMapsSource(basemaps) {
  let sourceObjects = {};

  basemaps.forEach((baseMapSource) => {
    sourceObjects[baseMapSource.id] = {
      type: "raster",
      tiles: [baseMapSource.tiles],
      tileSize: 256,
      attribution: baseMapSource.attribution,
      minzoom: 0,
      maxzoom: 22,
    };
  });
  return sourceObjects;
}

// create object for base map layers
function setBaseMapsLayer(basemaps) {
  let layerObjects = [];

  basemaps.forEach((baseMapLayer, ix) => {
    let layerObject = {
      id: baseMapLayer.id,
      type: "raster",
      source: baseMapLayer.id,
    };
    if (ix == 0) {
      activeBaseLayer.value = baseMapLayer.id;
      // first object in maps.json will be default base map
      layerObject.layout = {
        visibility: "visible",
      };
    } else {
      // others are already added but not visible
      layerObject.layout = {
        visibility: "none",
      };
    }
    layerObjects.push(layerObject);
  });
  return layerObjects;
}

onMounted(() => {
  // instantiate map object
  map.value = markRaw(
    new Map({
      mapId: "map_1",
      container: mapContainer.value,
      attributionControl: true,
      style: {
        version: 8,
        sources: setBaseMapsSource(basemaps.value),
        layers: setBaseMapsLayer(basemaps.value),
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf", // https://maplibre.org/maplibre-gl-js-docs/style-spec/glyphs/
      },
    })
  );

  // get lat, lng coord. of cursor and asign it to variables
  map.value.on("mousemove", function (e) {
    latCoord.value = e.lngLat.wrap().lat.toFixed(5);
    lngCoord.value = e.lngLat.wrap().lng.toFixed(5);
  });

  // add controls included in maplibre
  map.value.addControl(new ScaleControl(), "bottom-right");
  map.value.addControl(new FullscreenControl(), "top-right");
  map.value.addControl(new NavigationControl(), "top-right");

  // add thrid-party controls
  map.value.addControl(
    new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        line_string: true,
        trash: true,
      },
    })
  );

  map.value.once("load", () => {
    // add data source
    map.value.addSource("sites", {
      type: "geojson",
      data: sites.value,
    });

    // add data layer
    map.value.addLayer({
      id: "sites",
      type: "circle",
      source: "sites",
      paint: {
        "circle-color": defaultCircleColor.value,
        "circle-radius": 4,
        "circle-stroke-width": 0.5,
        "circle-stroke-color": "#fff",
      },
      layout: {
        visibility: "visible",
      },
    });
  });
}),
  onUnmounted(() => {
    map.value?.remove();
  });
</script>

<template>
  <div class="map-wrap">
    <div class="map" ref="mapContainer" @mousemove="updateLatLng">
      <!-- Navigation buttons -->

      <div class="fixed-bottom">
        <button
          v-for="title in navbarTitles"
          :key="title"
          @click="isCollapsed ? setPanelTitle($event) : 0, toggleSidebar()"
          type="button"
          class="btn btn-primary"
        >
          {{ title }}
        </button>

        <div class="cursor-position">
          Lat: {{ latCoord }}, Lng: {{ lngCoord }}
        </div>
      </div>

      <div id="left-panel" class="sidebar flex-center left collapsed">
        <div class="sidebar-content rounded-rect">
          <LeftPanel
            :title="panelTitle"
            :map="map"
            :activeBaseLayer="activeBaseLayer"
            :isCollapsed="isCollapsed"
            @collapse-event="setIsCollapsedTrue"
          />
        </div>
      </div>
    </div>
  </div>
</template>

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

.fixed-bottom {
  position: absolute;
  width: fit-content;
  height: fit-content;
  margin: 0 auto;
  z-index: 1;
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
  background-color: #304b9b;
  color: #8eb7e2;
  font-weight: bold;
  border: solid transparent;
  z-index: 1;
}

.btn:hover {
  background-color: #8eb7e2;
  color: #304b9b;
  border: solid transparent;
}

.cursor-position {
  background: rgba(255, 255, 255, 0.5);
  z-index: 1;
}

.sidebar {
  transition: transform 1s;
  z-index: 1;
  width: 400px;
  height: 100%;
  padding-top: 2.5%;
  padding-bottom: 2.5%;
}

.flex-center {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-center.left {
  left: 0px;
}

.left.collapsed {
  transform: translateX(-395px);
}

.sidebar-content {
  width: 95%;
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  color: grey;
  overflow-y: hidden;
}

.rounded-rect {
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 50px -25px black;
}
</style>
