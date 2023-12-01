import { defineStore } from "pinia";
import { ref } from "vue";

export const useFilterStore = defineStore("filter", () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */
  const filterExpressions = ref(null);

  return { filterExpressions };
});
