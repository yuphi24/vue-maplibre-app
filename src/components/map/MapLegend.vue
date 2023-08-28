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
  <div class="legend-container" v-if="legend != null">
    <button
      class="btn-color-palette"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#collapseLegend"
      aria-expanded="false"
      aria-controls="collapseLegend"
    >
      Legend
    </button>

    <div class="collapse" id="collapseLegend" v-if="legend != null">
      <div class="card card-body">
        <div class="legend-entries" v-for="entry in legend" :key="entry.id">
          <button
            class="legend-color-btn"
            :style="{
              'background-color': entry.colorHEX,
            }"
          ></button>
          <div class="legend-values">{{ entry.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-color-palette {
  display: block;
  width: 100%;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem; /* Similar padding to form-select */
  font-size: 0.875rem;
  text-align: left;
  line-height: 1.5;
  color: #212529; /* Bootstrap default text color */
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  border: 1px solid #ced4da; /* Border color */
  border-radius: 0.25rem; /* Border radius */
  appearance: none; /* This is to remove the default arrow of a real select element. Might not be needed for a div but added for completeness. */
  cursor: pointer; /* To give the feeling that it's clickable */
  /* Adding a faux dropdown arrow using a pseudo-element */
  &:after {
    position: absolute;
    right: 0.5em;
    pointer-events: none; /* Make it non-interactive */
  }

  /* Styling for interaction states */
  &:hover {
    border-color: #b5b5b5;
  }

  &:active,
  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25); /* Bootstrap-style focus shadow */
    border-color: #0d6efd; /* Bootstrap primary blue */
  }
}

.card {
  cursor: default;
  width: 100%;
}

.legend-container {
  position: absolute;
  bottom: 4rem;
  right: 0.5rem;
  z-index: 1;
}

.legend-body {
  padding: 3px;
}

.legend-entries {
  display: flex;
  align-items: center;
  padding: 1px;
}

.legend-color-btn {
  width: 36px;
  height: 20px;
  cursor: default;
  border-color: gray;
}

.legend-values {
  padding: 1px;
}
</style>
