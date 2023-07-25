<script setup>
import { defineEmits, defineProps } from "vue";

import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { Map } from "maplibre-gl";

defineEmits(["toggle-dt-event"]);
const props = defineProps({ map: Map });
console.log(props.map.getSource("sites")._data.features);
// const data = props.map.getSource("sites")._data.features;

DataTable.use(DataTablesCore);

const columns = [
  { data: "name" },
  { data: "position" },
  { data: "office" },
  { data: "extn" },
  { data: "start_date" },
  { data: "salary" },
];

const options = {
  dom: "Bftip",
  responsive: true,
  select: true,
};
</script>

<template>
  <div class="data-table-overlay">
    <div class="attribute-table rounded-rect collapsed">
      <div class="attribute-table-header">
        <h3 class="attribute-table-title">Attribute Table</h3>
        <button
          type="button"
          class="btn-close btn-close-white pull-right"
          aria-label="Close"
          @click="$emit('toggle-dt-event')"
        ></button>
      </div>
      <div class="attribute-table-content">
        <DataTable
          :columns="columns"
          :options="options"
          class="display nowrap"
          width="100%"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "bootstrap";
@import "datatables.net-bs5";
@import "datatables.net-dt";
.data-table-overlay {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.attribute-table {
  position: relative;
  width: 90%;
  height: 85%;
  top: 50%;
  left: 50%;
  /* padding-top: 2.5%; */
  overflow: hidden;
  padding-bottom: 2.5%;
  background-color: white;
  box-shadow: 0 0 50px -25px black;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  z-index: 1000;
}

.rounded-rect {
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 50px -25px black;
}

.attribute-table-header {
  background-color: #304b9b;
  border-bottom: 0.2rem solid #8eb7e2;
}

.attribute-table-title {
  display: inline-block;
  color: #8eb7e2;
  font-weight: bold;
  padding-top: 10px;
  padding-bottom: 5px;
  padding-left: 15px;
}

.btn-close {
  float: right;
  color: #8eb7e2;
  display: inline-block;
  margin-top: 15px;
  margin-right: 15px;
}

.attribute-table-content {
  padding: 5px;
}
</style>
