<template>
  <aside class="filter-panel">
    <div class="filter">
      <h1 class="filter-title">
        <span>
          Filter
          <i class="icofont-cart-alt icofont-1x"></i>
        </span>
        <button @click="toggleFil" class="cart-close">&times;</button>
      </h1>

      <div class="filter-body"></div>
    </div>
  </aside>
</template>

<script>
export default {
  name: "FilterPanel",
  props: ["toggleFil"],
};
</script>

<style>
.filter-panel {
  z-index: 1;
}
</style>
