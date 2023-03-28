<!-- 
Pseudo Code

1. Setup template for 

 -->

<template>
  <div class="baseMap">
    <h3>Base Map</h3>
    <!-- <div class="baseMapsContainer">
      <img
        @click="consoloLog"
        src="https://stamen-tiles.a.ssl.fastly.net/terrain/0/0/0.jpg"
        alt="test"
      />
    </div> -->
    <div class="card" style="width: 10rem">
      <img
        class="card-img-top"
        src="https://stamen-tiles.a.ssl.fastly.net/terrain/0/0/0.jpg"
        alt="Card image cap"
      />
      <div class="card-body">
        <h5 class="card-title">Placeholder for map title</h5>
        <!-- <p class="card-text">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
        <a href="#" class="btn btn-primary">Go somewhere</a> -->
      </div>
    </div>
    <div class="card" style="width: 10rem">
      <img
        class="card-img-top"
        src="https://stamen-tiles.a.ssl.fastly.net/terrain/0/0/0.jpg"
        alt="Card image cap"
      />
      <div class="card-body">
        <h5 class="card-title">Placeholder for map title</h5>
        <!-- <p class="card-text">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
        <a href="#" class="btn btn-primary">Go somewhere</a> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseMapsPanel",
};
</script>

<style></style>
