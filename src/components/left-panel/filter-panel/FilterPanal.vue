<script setup>
import { defineProps, ref, watch } from "vue";
import { Map } from "maplibre-gl";

import { useFilterStore } from "@/store/filter";

import FilterElement from "./FilterElement.vue";

const props = defineProps({ map: Map, heatFlowSchema: Object });

const filters = useFilterStore();

const filterIds = ref([]);
const maxNrOfFilters = ref(4);
const reachedFilterLimit = ref(false);

/**
 * @description Watches changes in filterExpressions object and set the filter to map.
 */
watch(filters.filterExpressions, () => {
  console.log("jo wird gecheckt wenn sich was ändert");
  applyFilterToMap();
});

/**
 * @description Is called when btn gets clicked. New entry added to array with the current date when btn gets clicked (as id for filterElement).
 */
function addFilterElement() {
  if (filterIds.value.length <= maxNrOfFilters.value) {
    filterIds.value.push(Date.now());
  } else {
    reachedFilterLimit.value = true;
    console.log("You reached the maximum number of filters");
  }
}

/**
 * @description remove corresponding id of filter from array and filterExpressions object.
 * @param {Object} event
 */
const removeFilterElement = (event) => {
  if (filterIds.value.includes(event.id)) {
    /*remove id from filterIds */
    const ix = filterIds.value.indexOf(event.id);
    filterIds.value.splice(ix, 1);
    /*remove filterExpression from object */
    delete filters.filterExpressions[event.id];
  } else {
    console.log("FilterElement ID is not in filterIds array");
  }

  if (filterIds.value.length === maxNrOfFilters.value) {
    reachedFilterLimit.value = false;
  }
};

/**
 * @description combine multiple filter expressions to one. All filter expressions have to be true.
 * @returns {Array} containing filter expressions
 */
function writeFilterExpression() {
  let expression = ["all"];

  Object.entries(filters.filterExpressions).forEach(([key]) => {
    if (filters.filterExpressions[key].length != 0) {
      expression.push(filters.filterExpressions[key]);
    } else {
      console.log("Empty filterExpression for filter with key: " + key);
    }
  });
  console.log(expression);

  return expression;
}

/**
 * @description set Filter to map via internal maplibre function.
 */
function applyFilterToMap() {
  const expression = writeFilterExpression();

  props.map.setFilter("sites", expression);
}
</script>

<template>
  <div class="filters-panel">
    <FilterElement
      v-for="id in filterIds"
      :key="id"
      :id="id"
      :heatFlowSchema="heatFlowSchema"
      :map="map"
      @remove-filterElement="removeFilterElement($event)"
    >
    </FilterElement>

    <div class="filter-managing-tools">
      <label for="add-filter-btn" v-if="reachedFilterLimit"
        >You reached the max number of filters</label
      >
      <button
        id="add-filter-btn"
        class="btn btn-primary"
        v-if="!reachedFilterLimit"
        @click="addFilterElement()"
      >
        + Add Filter
      </button>
    </div>
  </div>
</template>

<style scoped></style>
