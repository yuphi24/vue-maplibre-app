<!-- Map Legend -->
<script setup>
import { defineProps, ref, watch } from "vue";

const props = defineProps({ legend: Object });
const legend = ref(null);

watch(props, (newProps) => {
  legend.value = newProps.legend;

  console.log("--------legend");
  console.log(legend.value);
});
</script>

<template>
  <div class="legend-container">
    <div class="legend-title">Legend</div>
    <div class="legend-body"></div>
  </div>
</template>

<style scoped></style>
