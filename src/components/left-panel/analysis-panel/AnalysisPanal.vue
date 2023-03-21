<template>
  <aside class="analysis-panel">
    <div class="analysis">
      <h1 class="analysis-title">
        <span>
          Analysis
          <i class="icofont-cart-alt icofont-1x"></i>
        </span>
        <button @click="toggleAna" class="cart-close">&times;</button>
      </h1>

      <div class="analysis-body"></div>
    </div>
  </aside>
</template>

<script>
export default {
  name: "AnalysisPanel",
  props: ["toggleAna"],
};
</script>

<style>
.analysis-panel {
  z-index: 1;
}
</style>
