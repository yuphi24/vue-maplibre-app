<script setup>
import { Map } from "maplibre-gl";
import { defineProps } from "vue";

import FilterElement from "./FilterElement.vue";

const props = defineProps({ map: Map, heatFlowSchema: Object });

// console.log(props.heatFlowSchema);
console.log("here befor");
console.log(props.map.queryRenderedFeatures({ layers: ["sites"] }));
/**
 * Desc.:
 * - Container for the filter.
 * - Inside here, users can set up filter.
 * - They are in a hirarchical order and are connected by a "logic and".
 * - New filter component through button "add filter"
 *
 * Manage Filter:
 *  - Add new filter
 *  - Delete existing filter
 *  - Clear all filters
 *  - Store set filters
 *
 * Pseudo Code:
 * -
 */

// props.map.setFilter("sites", [
//   "all",
//   [">", ["get", "q"], 0],
//   ["<", ["get", "q"], 200],
// ]);

// function onCLickDelete() {
//   props.map.setFilter("sites", ["all", ["==", ["get", "method"], "drilling"]]);
//   console.log(props.map.queryRenderedFeatures({ layers: ["sites"] }));
// }
</script>

<template>
  <div class="filters-container">
    <FilterElement :heatFlowSchema="heatFlowSchema" :map="map" />
    <!-- <div class="filter-managing-tools">
      <button class="btn btn-primary" @click="onCLickDelete">
        + Add Filter
      </button>
    </div> -->
  </div>
</template>

<style scoped></style>
