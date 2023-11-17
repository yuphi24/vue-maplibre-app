<script setup>
import { ref } from "vue";

const isCollapsed = ref(true);
const navigationBarPanel = ref([
  "Settings",
  "Filter",
  "Statistics",
  "Analysis",
]);

const setIsCollapsed = () => (isCollapsed.value = !isCollapsed.value);
</script>

<template>
  <div class="navigationBar">
    <div class="fixed-bottom">
      <button
        v-for="title in navigationBarPanel"
        :key="title"
        @click="
          isCollapsed ? setPanelTitle($event) : 0,
            toggleSidebar(),
            setIsCollapsed()
        "
        type="button"
        class="btn btn-primary"
      >
        {{ title }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.fixed-bottom {
  position: absolute;
  width: fit-content;
  height: fit-content;
  margin: 0 auto;
  z-index: 1;
}
</style>
