<script setup>
import { defineProps, ref, watch } from "vue";
import { Map } from "maplibre-gl";

import FilterElement from "./FilterElement.vue";

const props = defineProps({ map: Map, heatFlowSchema: Object });

const filterIds = ref([]);
const filterExpressions = ref({});

/**
 * @description Watches changes in filterExpressions object and set the filter to map.
 */
watch(filterExpressions.value, () => {
  console.log("jo wird gecheckt wenn sich was ändert");
  applyFilterToMap();
});

/**
 * @description Is called when btn gets clicked. New entry added to array with the current date when btn gets clicked (as id for filterElement).
 */
function addFilterElement() {
  if (filterIds.value.length <= 3) {
    filterIds.value.push(Date.now());
  } else {
    console.log("You reached the maximum number of filters");
  }
}

/**
 * @description Set id of filter als key and expression as value
 * @param {Object} event
 */
const setSendFilterExpression = (event) => {
  filterExpressions.value[event.id] = event.expression;
  console.log("FilterPanel");
  console.log(filterExpressions.value);
};

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
    delete filterExpressions.value[event.id];
  } else {
    console.log("FilterElement ID is not in filterIds array");
  }
};

/**
 * @description combine multiple filter expressions to one. All filter expressions have to be true.
 * @returns {Array} containing filter expressions
 */
function writeFilterExpression() {
  let expression = ["all"];

  Object.entries(filterExpressions.value).forEach(([key]) => {
    if (filterExpressions.value[key].length != 0) {
      expression.push(filterExpressions.value[key]);
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
      @send-filterExpression="setSendFilterExpression($event)"
      @remove-filterElement="removeFilterElement($event)"
    >
    </FilterElement>

    <div class="filter-managing-tools">
      <button class="btn btn-primary" @click="addFilterElement()">
        + Add Filter
      </button>
    </div>
  </div>
</template>

<style scoped></style>
