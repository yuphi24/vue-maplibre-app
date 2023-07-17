<script setup>
import { ref, defineProps } from "vue";

import baseMapsObject from "./maps.json";
import { Map } from "maplibre-gl";

const props = defineProps({ title: String, map: Map, activeBaseLayer: String });

const baseMaps = ref(baseMapsObject);
const activeBaseLayer = ref(props.activeBaseLayer);

function changeBaseLayer(oldBaseLayer, newBaseLayer) {
  // change base map on click
  if (newBaseLayer == oldBaseLayer) {
    return;
  } else {
    props.map.setLayoutProperty(oldBaseLayer, "visibility", "none");
    props.map.setLayoutProperty(newBaseLayer, "visibility", "visible");
    activeBaseLayer.value = newBaseLayer;
  }
}
</script>

<template>
  <div class="base-map-settings">
    <div class="settings-content-title">
      <h3>Base Map</h3>
    </div>
    <div class="settings-content-body">
      <div
        class="card"
        style="width: 9rem"
        v-for="baseMap in baseMaps"
        :key="baseMap.id"
        @click="changeBaseLayer(activeBaseLayer, baseMap.id)"
      >
        <img
          class="card-img-top"
          :src="baseMap.cardImage"
          alt="Card image cap"
        />
        <div class="card-body">
          <h5 class="card-title">{{ baseMap.title }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.base-map-settings {
  display: block;
  height: auto;
  height: 100;
  padding: 1rem;
}

.settings-content-body {
  display: flex;
  flex-wrap: wrap;
}

.card {
  /* display: inline-block; */
  height: auto;
  width: 10rem;
  padding: 2px;
  cursor: pointer;
}
</style>
