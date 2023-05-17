<script setup>
import { defineProps, ref, watch } from "vue";
import testData from "@/assets/data/small_sites.geojson";

const props = defineProps(["map", "selectedProperty"]);
const circleRadius = ref(5);
const circleColors = ref([
  "#ffffcc",
  "#a1dab4",
  "#41b6c4",
  "#2c7fb8",
  "#253494",
  "#fed976",
  "#feb24c",
  "#fd8d3c",
  "#f03b20",
  "#bd0026",
]);
const interpolationTypes = ref({
  linear: {
    name: "Linear",
    expression: "linear",
  },
  exponential: {
    name: "Exponential",
    base: 0,
    expression: "exponential",
  },
  cubicBezier: {
    name: "Cubic Bezier",
    x1: 1,
    y1: 1,
    x2: 1,
    y2: 1,
    expression: "cubic-bezier",
  },
});

const selectedProperty = ref("Select attribute");
const isPropertySelected = ref(false);
const selectedInterpolationType = ref(interpolationTypes.value.linear);

watch(circleRadius, (currentValue) => {
  // change circle radius whene user changes value at input element
  props.map.setPaintProperty("sites", "circle-radius", parseInt(currentValue));
});

function toggleIsSelected() {
  if (isPropertySelected.value) {
    return;
  } else {
    isPropertySelected.value = !isPropertySelected.value;
  }
}

function setCircleColor(colorHEX) {
  // set Circle color
  if (props.map.getPaintProperty("sites", "circle-color") == colorHEX) {
    return;
  } else {
    props.map.setPaintProperty("sites", "circle-color", colorHEX);
  }
}

// function consoleLog() {
//   console.log("Selected interpolation: " + selectedInterpolationType.value);
// }

function setDataDrivenPaintProperties(featuresProperty) {
  // TODO: Include case attribute with prefedined classes
  const paintProperties = generateInterpolatePaintProperty(featuresProperty);

  props.map.setPaintProperty("sites", "circle-color", paintProperties);
}

function generateInterpolatePaintProperty(featuresProperty) {
  // only for continuous number value, later on it should be working for any kind of property
  let paintProperties = new Array();
  const min = getMin(featuresProperty);
  const max = getMax(featuresProperty);
  let expression = [];

  if (selectedInterpolationType.value.name == "Linear") {
    expression.push(selectedInterpolationType.value.expression);
  } else if (selectedInterpolationType.value.name == "Exponential") {
    expression.push(
      selectedInterpolationType.value.expression,
      selectedInterpolationType.value.base
    );
  } else if (selectedInterpolationType.value.name == "Cubic Bezier") {
    expression.push(
      selectedInterpolationType.value.expression,
      selectedInterpolationType.value.x1,
      selectedInterpolationType.value.y1,
      selectedInterpolationType.value.x2,
      selectedInterpolationType.value.y2
    );
  } else {
    console.log("Type of interpolation not found");
  }

  paintProperties.push("interpolate");
  paintProperties.push(expression);
  paintProperties.push(["get", featuresProperty]); // TODO: adjust interpolation type or get rid of outlier
  paintProperties.push(min, "rgba(33,102,172,0)"); // TODO: include https://www.vis4.net/chromajs/ for color selection
  paintProperties.push(10, "green");
  paintProperties.push(100, "blue");
  paintProperties.push(1000, "orange");
  paintProperties.push(max, "yellow");

  console.log(paintProperties);

  return paintProperties;
}

function getMin(featuresProperty) {
  // get minimum value of number propery of all containing features
  let min =
    props.map.getSource("sites")._data.features[0].properties[featuresProperty];
  props.map.getSource("sites")._data.features.forEach((feature) => {
    if (feature.properties[featuresProperty] < min) {
      min = feature.properties[featuresProperty];
    }
  });
  return min;
}

function getMax(featuresProperty) {
  // get maximum value of number propery of all containing features
  let max =
    props.map.getSource("sites")._data.features[0].properties[featuresProperty];
  props.map.getSource("sites")._data.features.forEach((feature) => {
    if (feature.properties[featuresProperty] > max) {
      max = feature.properties[featuresProperty];
    }
  });
  return max;
}

/**
 * Pseudo Code data driven coloring
 * https://www.vis4.net/chromajs/#chroma-valid
 *
 * 1. get property
 * 2. If continuous
 * 3. Get min max to set scale for color
 * 4. Set circle color array containig maplibre expressions
 * 5. Set paint property
 *
 * 1. get property
 * 2. If classes
 * 3. Get classes as Set()
 * 4. Set circle color array containig maplibre expressions
 * 5. Set paint property
 */

// consoleLog(props.selectedProperty);
</script>

<template>
  <div class="circle-styling-settings">
    <div class="settings-content-title">
      <h3>Style Circle</h3>
    </div>
    <div class="settings-content-body">
      <div class="circle-settings">
        <div class="circle-color">
          <label for="customRange1" class="form-label">Circle Size</label>
          <input
            type="range"
            class="form-range"
            id="customRange1"
            min="0"
            step="1"
            max="10"
            v-model="circleRadius"
          />
          <span class="text-muted">{{ circleRadius }}</span>
        </div>
      </div>
      <div class="circle-settings">
        <!-- Inspired by: https://maplibre.org/maplibre-gl-js-docs/example/color-switcher/ -->
        <div class="circle-color">
          <fieldset>
            <label>Fill color</label>
            <div id="swatches">
              <button
                v-for="colorHEX in circleColors"
                :key="colorHEX"
                :style="{ 'background-color': colorHEX }"
                @click="setCircleColor(colorHEX)"
              ></button>
            </div>
          </fieldset>

          <fieldset>
            <div class="data-driven-coloring">
              <label>Coloring based on</label>
              <select
                name="data-driven-coloring"
                id="data-driven-coloring"
                v-model="selectedProperty"
                @change="
                  setDataDrivenPaintProperties(selectedProperty.key),
                    toggleIsSelected()
                "
              >
                <option selected disabled hidden>Select attribute</option>
                <option
                  :value="{ key }"
                  v-for="(value, key) in testData.features[0].properties"
                  :key="key"
                  :selectedProperty="{ value }"
                >
                  {{ key }}
                </option>
              </select>
            </div>

            <div
              class="data-driven-coloring-interpolation"
              v-if="isPropertySelected"
            >
              <label>Type of interpolation</label>
              <select
                name="data-driven-coloring"
                id="data-driven-coloring"
                v-model="selectedInterpolationType"
                @change="setDataDrivenPaintProperties(selectedProperty.key)"
              >
                <option selected disabled hidden>Linear</option>
                <option
                  v-for="(value, key) in interpolationTypes"
                  :value="value"
                  :key="key"
                >
                  {{ value.name }}
                </option>
              </select>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-content-body {
  display: flex;
  justify-content: center;
}

.circle-settings {
  width: 100%;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 10px;
}

.circle-color fieldset {
  border: none;
  padding: 0;
  margin: 0 0 10px;
}

.circle-color fieldset:last-child {
  margin: 0;
}

.circle-color select {
  width: 100%;
}

label {
  display: block;
  font-weight: bold;
  margin: 0 0 5px;
}

.circle-color button {
  display: inline-block;
  width: 36px;
  height: 20px;
  border: none;
  cursor: pointer;
}

.circle-color button:focus {
  outline: none;
}

.circle-color button:hover {
  box-shadow: inset 0 0 0 3px rgba(0, 0, 0, 0.1);
}
</style>
