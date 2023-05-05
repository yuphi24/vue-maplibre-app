<script setup>
import { defineProps, ref, watch } from "vue";

const props = defineProps(["map"]);
const circleSize = ref(5);
const circleColors = ref([
  "#ffffcc",
  "#a1dab4",
  "#41b6c4",
  "#2c7fb8",
  "#253494",
  "#fed976",
  "#feb24c",
  "#fd8d3c",
  "#f03b20",
  "#bd0026",
]);

watch(circleSize, (currentValue) => {
  props.map.setPaintProperty("sites", "circle-radius", parseInt(currentValue));
});

function setCircleColor(colorHEX) {
  if (props.map.getPaintProperty("sites", "circle-color") == colorHEX) {
    return;
  } else {
    props.map.setPaintProperty("sites", "circle-color", colorHEX);
  }
}
</script>

<template>
  <div class="circle-styling-settings">
    <div class="settings-content-title">
      <h3>Style Circle</h3>
    </div>
    <div class="settings-content-body">
      <div class="circle-size">
        <label for="customRange1" class="form-label">Circle Size</label>
        <input
          type="range"
          class="form-range"
          id="customRange1"
          min="0"
          step="1"
          max="10"
          v-model="circleSize"
        />
        <span class="text-muted">{{ circleSize }}</span>
      </div>
      <div class="circle-color">
        <fieldset>
          <label>Fill color</label>
          <div id="swatches">
            <button
              v-for="colorHEX in circleColors"
              :key="colorHEX"
              :style="{ 'background-color': colorHEX }"
              @click="setCircleColor(colorHEX)"
            ></button>
          </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-content-body {
  display: flex;
  justify-content: center;
}

.circle-color {
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 10px;
}

.circle-color fieldset {
  border: none;
  padding: 0;
  margin: 0 0 10px;
}

.circle-color fieldset:last-child {
  margin: 0;
}

.circle-color select {
  width: 100%;
}

label {
  display: block;
  font-weight: bold;
  margin: 0 0 5px;
}

.circle-color button {
  display: inline-block;
  width: 36px;
  height: 20px;
  border: none;
  cursor: pointer;
}

.circle-color button:focus {
  outline: none;
}

.circle-color button:hover {
  box-shadow: inset 0 0 0 3px rgba(0, 0, 0, 0.1);
}
</style>
