<template>
  <button class="addFilter">Add Filter</button>
  <div class="filter">Here filter options</div>
  <div class="dropdown mt-3">
    <button
      class="btn btn-secondary dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
    >
      Select Attribute
    </button>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="#">Here</a></li>
      <li><a class="dropdown-item" href="#">Selection</a></li>
      <li><a class="dropdown-item" href="#">Of</a></li>
      <li><a class="dropdown-item" href="#">Attributes</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FilterPanel",
};
</script>

<style></style>
