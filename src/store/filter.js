import { defineStore } from "pinia";
import { ref } from "vue";

export const useFilterStore = defineStore("filter", () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */
  const filterExpressions = ref({});

  function addFilterExpression(filterExpression, filterId) {
    filterExpressions.value[filterId] = filterExpression;
  }

  function removeFilterExpression(filterId) {
    delete filterExpressions.value[filterId];
  }

  return { filterExpressions, addFilterExpression, removeFilterExpression };
});
