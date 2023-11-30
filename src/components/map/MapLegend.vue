<!-- Map Legend -->
<script setup>
import { ref } from "vue";
import { useLegendStore } from "@/store/legend";

import {
  CButton,
  CCollapse,
  CCard,
  CCardBody,
  CContainer,
} from "@coreui/bootstrap-vue";

const legend = useLegendStore();

const visible = ref(false);
</script>

<template>
  <div class="legend-container" v-if="legend.legend">
    <CContainer>
      <CButton
        class="position-absolute top-0 end-0 translate-middle btn btn-sm btn-primary"
        color="primary"
        @click="visible = !visible"
        >Legend</CButton
      >
      <CCollapse :visible="visible">
        <CCard class="mt-3">
          <CCardBody>
            <div class="d-flex" v-for="entry in legend.legend" :key="entry.id">
              <CButton
                :style="{
                  'background-color': entry.colorHEX,
                }"
                @click="visible = !visible"
              ></CButton>

              <div>{{ entry.text }}</div>
            </div>
          </CCardBody>
        </CCard>
      </CCollapse>
    </CContainer>
  </div>
</template>

<style scoped>
.legend-container {
  position: absolute;
  bottom: 4rem;
  right: 0.5rem;
  z-index: 1;
}
</style>
