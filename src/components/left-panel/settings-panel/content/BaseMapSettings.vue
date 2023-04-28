<script setup>
import { ref } from "vue";

import maps from "./maps.json";

const basemaps = ref(maps);

function consoleLog() {
  console.log(this.basemaps);
}
</script>

<template>
  <div class="base-map-settings">
    <div class="settings-content-title">
      <h3>Base Map</h3>
    </div>
    <div class="settings-content-body">
      <div
        @click="consoleLog"
        class="card"
        style="width: 9rem"
        v-for="map in basemaps"
        :key="map.id"
      >
        <img class="card-img-top" :src="map.cardImage" alt="Card image cap" />
        <div class="card-body">
          <h5 class="card-title">{{ map.title }}</h5>
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
