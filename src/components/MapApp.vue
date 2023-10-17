<!-- Main component -->

<script setup>
// vue
import { onMounted, onUnmounted, markRaw, ref } from "vue";

// map viewer
import { Map } from "maplibre-gl";
import yaml from "js-yaml";
// import turf from "@turf/helpers";

// data
import maps from "./left-panel/settings-panel/maps.json";
import sitesURL from "@/assets/data/test_local.geojson";

// components
import AttributeTable from "./common/AttributeTable.vue";
import CursorCoordinates from "./map/CursorCoordinates.vue";
import DataSources from "./map/DataSources.vue";
import LeftPanel from "./left-panel/LeftPanel.vue";
import MapControls from "./map/MapControls.vue";
import InfoPopup from "./map/InfoPopup.vue";
import DataLayer from "./map/DataLayer.vue";
import MapLegend from "./map/MapLegend.vue";

const mapContainer = ref();
const map = ref();
const navbarTitles = ref(["Settings", "Filter", "Statistics", "Analysis"]); // can be extend with custom buttons
const panelTitle = ref("");
const basemaps = ref(maps);
const activeBaseLayer = ref("");
const sites = ref(sitesURL);
const defaultCircleColor = ref("#41b6c4");
const isCollapsed = ref(true);
const dataSchema = ref();
const heatFlowSchema = ref();
const legend = ref(null);
const dataAPI = ref(null);
const geojson = ref(null);

const setIsCollapsed = () => (isCollapsed.value = !isCollapsed.value);
const toggleSidebar = () => {
  // Source code for sidebar https://docs.mapbox.com/mapbox-gl-js/example/offset-vanishing-point-with-padding/
  const elem = document.getElementById("left-panel");
  // Add or remove the 'collapsed' CSS class from the sidebar element.
  // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
  const collapsed = elem.classList.toggle("collapsed");
  const padding = {};
  // 'id' is 'right' or 'left'. When run at start, this object looks like: '{left: 300}';
  padding["left-panel"] = collapsed ? 0 : 300; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
  // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
};

const handleLegend = (l) => {
  legend.value = l;
  console.log("parentCompnent");
  console.log(legend.value);
};

const showsDataTable = ref(false);
const toggleDataTable = () => {
  showsDataTable.value = !showsDataTable.value;
};

/**
 * @description
 */
function fetchSchemaLocal(path) {
  // /api/v1/schema/
  fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.text();
    })
    .then((yamlText) => {
      dataSchema.value = yaml.load(yamlText);
      heatFlowSchema.value = dataSchema.value.components.schemas.HeatFlow;
      // console.log("--------Send dohanna--------");
      // console.log(Object.keys(dataSchema.value.components.schemas.HeatFlow));
    })
    .catch(function (error) {
      console.log("Failed to fetch the YAML file.");
      console.error(error);
    });
}

// fetchAPISchema();
fetchSchemaLocal("/ghfdb_API_copy.yaml");

//TODO: Schema file deviates from local file. Needs to be adjusted. Differences in enum, oneOf, ...
/**
 * @description
 */
// function fetchSchemaAPI() {
//   // /api/v1/schema/
//   fetch("http://139.17.54.176:8000/api/v1/schema/")
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("HTTP error " + response.status);
//       }
//       return response.text();
//     })
//     .then((yamlText) => {
//       dataSchema.value = yaml.load(yamlText);
//       heatFlowSchema.value = dataSchema.value.components.schemas.Measurement;
//       console.log("--------Send dohanna--------");
//       console.log(heatFlowSchema.value.properties.environment.oneOf[1]);
//     })
//     .catch(function (error) {
//       console.log("Failed to fetch the YAML file.");
//       console.error(error);
//     });
// }

/**
 *
 * @param {*} siteObject
 */
function json2PointFeature(siteObject) {
  /**
   * Pseudo Code:
   * 1. get relevant property keys
   * 2. iterate over all keys
   *  if key == sample -> make coord arr
   *  else write same structure key value to properties obj
   * 3. write GeoJSON point feature turf.point()
   * 4. return point feature
   */
  const featKeys = Object.keys(siteObject);

  let uuidValue = siteObject["uuid"];
  let coord = [];
  let property = {};

  featKeys.forEach((key) => {
    if (siteObject[key] == "sample") {
      if (siteObject[key].location != null) {
        coord.push(siteObject[key].location.coordinates);
      }
    } else {
      // console.log("hat keine location");
      property[key] = siteObject[key];
    }
  });
  return {
    uuid: uuidValue,
    type: "Feature",
    geometry: { type: "Point", coordinates: coord },
    properties: { property },
  };
}

/**
 *
 * @param {*} fetchedData
 */
function json2GeoJSON(fetchedData) {
  let objectKeys = Object.keys(fetchedData);
  let featuresArray = [];

  objectKeys.forEach((ix) => {
    console.log("site: " + ix + "; " + fetchedData[ix]);
    featuresArray.push(json2PointFeature(fetchedData[ix]));
  });

  let geojson = { type: "FeatureCollection", features: featuresArray };
  console.log(geojson);

  return geojson;
}

/**
 *
 * @param {String} dataURL
 */
function fetchDataAPI(dataURL) {
  // /api/v1/measurements/heat-flow/?format=json
  fetch(dataURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      dataAPI.value = data;
      console.log("fetch data test");
      console.log("Output: ", dataAPI.value);
      geojson.value = json2GeoJSON(dataAPI.value.results);
    })
    .catch(function (error) {
      console.log("Failed to fetch the heat flow data file.");
      console.error(error);
    });
}

fetchDataAPI(
  "http://139.17.54.176:8000/api/v1/measurements/heat-flow/?format=json"
);

// get title of corresponding button and set it as title of sidepanel
function setPanelTitle(event) {
  panelTitle.value = event.srcElement.innerHTML;
}

// create object for base map sources
function setBaseMapsSource(basemaps) {
  let bmSourceObject = {};

  basemaps.forEach((baseMapSource) => {
    bmSourceObject[baseMapSource.id] = {
      type: "raster",
      tiles: [baseMapSource.tiles],
      tileSize: 256,
      attribution: baseMapSource.attribution,
      minzoom: 0,
      maxzoom: 22,
    };
  });
  return bmSourceObject;
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

  map.value.once("load", () => {
    // add data source
    map.value.addSource("sites", {
      type: "geojson",
      data: sites.value,
    });

    console.log("MapApp.vue raw sites");
    console.log(sites.value);

    // add data layer
    map.value.addLayer({
      id: "sites",
      type: "circle",
      source: "sites",
      paint: {
        "circle-color": defaultCircleColor.value,
        "circle-radius": 4,
        "circle-stroke-width": 0.5,
        "circle-stroke-color": "#a1dab4",
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

function printHeatFlowSchema() {
  console.log("heatflow schema mapapp");
  console.log(dataSchema.value);
}
</script>

<template>
  <div class="map-wrap">
    <div class="map" ref="mapContainer" @mousemove="updateLatLng">
      <DataSources :map="map" />
      <DataLayer :map="map" />
      <InfoPopup :map="map" />
      <MapControls :map="map" />
      <MapLegend :legend="legend" />

      <!-- Navigation buttons -->
      <div class="fixed-bottom">
        <button
          v-for="title in navbarTitles"
          :key="title"
          @click="
            isCollapsed ? setPanelTitle($event) : 0,
              toggleSidebar(),
              setIsCollapsed()
          "
          type="button"
          class="btn btn-primary"
        >
          {{ title }}
        </button>
        <div class="cursor-div">
          <CursorCoordinates :map="map" />
        </div>
      </div>

      <div id="left-panel" class="sidebar flex-center left collapsed">
        <div class="sidebar-content rounded-rect">
          <LeftPanel
            :title="panelTitle"
            :map="map"
            :activeBaseLayer="activeBaseLayer"
            :heatFlowSchema="heatFlowSchema"
            @collapse-event="setIsCollapsed()"
            @toggle-event="toggleSidebar()"
            @handle-legend-event="handleLegend"
          />
        </div>
      </div>

      <!-- <div id="legend" class="sidebar flex-center right collapsed"></div> -->

      <div class="trigger-data-table">
        <button
          type="button"
          class="btn-trigger-data-table btn btn-primary"
          @click="
            toggleDataTable();
            printHeatFlowSchema();
          "
        >
          Show Data Table
        </button>
      </div>
    </div>
  </div>
  <AttributeTable
    v-if="showsDataTable"
    @toggle-dt-event="toggleDataTable()"
    :map="map"
  />
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
  /* position: relative; */
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

.btn-trigger-data-table {
  position: relative;
  width: fit-content;
  height: fit-content;
  margin: 0 auto;
  z-index: 1;
}
</style>
