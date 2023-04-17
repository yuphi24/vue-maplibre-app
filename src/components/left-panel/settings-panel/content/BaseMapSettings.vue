<template>
  <div class="baseMapSettings">
    <div class="settings-content-title">
      <h3>Base Map</h3>
    </div>
    <div class="settings-content-body">
      <div
        @click="consoleLog"
        class="card"
        style="width: 10rem"
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

<script>
import maps from "./maps.json";

export default {
  name: "BaseMapSettings",
  data() {
    return {
      basemaps: maps,
    };
  },
  methods: {
    consoleLog() {
      console.log(this.basemaps);
    },
  },
};
</script>

<style>
.baseMapSettings {
  display: block;
  height: auto;
  height: 100;
  padding: 1rem;
}

.card {
  display: inline-block;
  height: auto;
  width: 10rem;
  padding: 2px;
  float: left;
}

.card-body :active {
}
</style>
