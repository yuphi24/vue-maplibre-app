<template>
  <div class="cluster">
    <h3>Cluster</h3>
    <!--
        Set default  
        ClusterMaxZoom
        ClusterRadius
    -->
    <input
      type="checkbox"
      class="btn-check"
      id="btn-check-outlined"
      autocomplete="off"
      @click="toggleCluster"
    />
    <label
      v-if="!isClustered"
      class="btn btn-outline-primary"
      for="btn-check-outlined"
      >Cluster</label
    >
    <label
      v-if="isClustered"
      class="btn btn-outline-primary"
      for="btn-check-outlined"
      >Uncluster</label
    >
    <div v-if="isClustered" class="clusterOptions">
      <label for="customRange1" class="form-label">ClusterMaxZoom</label>
      <input type="range" class="form-range" id="customRange1" />

      <label for="customRange1" class="form-label">ClusterRadius</label>
      <input type="range" class="form-range" id="customRange1" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ClusterPanel",
  data() {
    return {
      isClustered: false,
    };
  },
  methods: {
    toggleCluster() {
      this.isClustered = !this.isClustered;
    },
    consoloLog() {
      console.log("hallö");
    },
  },
};
</script>

<style></style>
