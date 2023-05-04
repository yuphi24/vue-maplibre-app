<script setup>
import { defineProps, ref, watch } from "vue";

const props = defineProps(["map"]);
const circleSize = ref(5);

watch(circleSize, (currentValue) => {
  props.map.setPaintProperty("sites", "circle-radius", parseInt(currentValue));
});
</script>

<template>
  <div class="circle-styling-settings">
    <div class="settings-content-title">
      <h3>Style Circle</h3>
    </div>
    <div class="settings-content-body">
      <div class="clusterOptions">
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
      <h6>Circle color</h6>
    </div>
  </div>
</template>

<style></style>
