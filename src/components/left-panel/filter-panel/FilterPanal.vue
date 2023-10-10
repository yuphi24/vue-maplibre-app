<script setup>
import { defineProps, ref } from "vue";
import { Map } from "maplibre-gl";

import FilterElement from "./FilterElement.vue";

const props = defineProps({ map: Map, heatFlowSchema: Object });

const filterIds = ref([]);
const filterExpressions = ref({});
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

function addFilter() {
  if (filterIds.value.length <= 3) {
    filterIds.value.push(Date.now());
    // filtersIndices.value.push(filtersIndices.value.length);
    console.log(filterIds.value);
  } else {
    console.log("You reached the maximum number of filters");
  }
}

const setSendFilterExpression = (event) => {
  filterExpressions.value[event.id] = event.expression;
  console.log("FilterPanel");
  console.log(filterExpressions.value);
};

const removeFilterElement = (event) => {
  console.log("removeFilterElement");
  console.log(event.id);
  if (filterIds.value.includes(event.id)) {
    const ix = filterIds.value.indexOf(event.id);
    filterIds.value.splice(ix, 1);
  } else {
    console.log("FilterElement ID is not in filterIds array");
  }
};

function testMultipleFilter() {
  // let filterExpression1 = [
  //   "all",
  //   [">=", ["get", "q"], -126],
  //   ["<=", ["get", "q"], 2000],
  // ];

  // let filterExpression2 = [["any"], ["in", ["get", "env"], "unspecified"]];

  let combinedFilterExpression = [
    "any",
    ["all", [">=", ["get", "q"], -126], ["<=", ["get", "q"], 0]],
    ["in", ["get", "env"], "unspecified"],
  ];

  props.map.setFilter("sites", combinedFilterExpression);
}
</script>

<template>
  <div class="filters-panel">
    <FilterElement
      v-for="value in filterIds"
      :key="value"
      :id="value"
      :heatFlowSchema="heatFlowSchema"
      :map="map"
      @send-filterExpression="setSendFilterExpression($event)"
      @remove-filterElement="removeFilterElement($event)"
    >
    </FilterElement>

    <div class="filter-managing-tools">
      <button class="btn btn-primary" @click="addFilter()">+ Add Filter</button>
    </div>
    <div class="test-btn">
      <button class="btn btn-primary" @click="testMultipleFilter()">
        Test combined filters
      </button>
    </div>
  </div>
</template>

<style scoped></style>
