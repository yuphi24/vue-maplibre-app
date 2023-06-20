<script setup>
import { defineEmits } from "vue";

import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";

defineEmits(["toggle-dt-event"]);

DataTable.use(DataTablesCore);

const columns = [
  { data: "name" },
  { data: "position" },
  { data: "office" },
  { data: "extn" },
  { data: "start_date" },
  { data: "salary" },
];
</script>

<template>
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
      <DataTable :columns="columns" class="display" width="100%" />
    </div>
  </div>
</template>

<style scoped>
@import "bootstrap";
@import "datatables.net-bs5";
@import "datatables.net-dt";
.attribute-table {
  position: absolute;
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
  z-index: 100;
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
