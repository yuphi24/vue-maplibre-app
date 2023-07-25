<!-- Dealing with map controls provided as third-party plugins  -->
<script setup>
import { Map } from "maplibre-gl";
import { defineProps, ref, watch } from "vue";

import {
  ScaleControl,
  FullscreenControl,
  NavigationControl,
} from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

const props = defineProps({ map: Map });
const map = ref(props.map);

watch(props, (newProps) => {
  map.value = newProps.map;

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
});
</script>

<template>
  <div class="no-vis"></div>
</template>

<style scoped></style>
