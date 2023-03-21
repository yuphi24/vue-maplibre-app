<template>
  <aside class="statistics-panel">
    <div class="statistics">
      <h1 class="statistics-title">
        <span>
          Statistics
          <i class="icofont-cart-alt icofont-1x"></i>
        </span>
        <button @click="toggleStat" class="cart-close">&times;</button>
      </h1>

      <div class="statistics-body"></div>
    </div>
  </aside>
</template>

<script>
export default {
  name: "StatisticsPanel",
  props: ["toggleStat"],
};
</script>

<style>
.statistics-panel {
  z-index: 1;
}
</style>
