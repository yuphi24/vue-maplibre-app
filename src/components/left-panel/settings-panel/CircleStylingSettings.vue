<script setup>
import { defineProps, ref, watch } from "vue";
// import testData from "@/assets/data/small_sites.geojson";

import chroma from "chroma-js";
// import Plotly from "plotly.js-dist";
import { Map } from "maplibre-gl";

/*
TODO: implement API request for data model (schemas) to know which data type or data structure an attribute is.
Shall help to differentiate between generateClassificationPaintProperty(featuresProperty) and generateInterpolatePaintProperty(featuresProperty).
*/
// Variables
const props = defineProps({ map: Map, heatFlowSchema: Object });
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
// const interpolationTypes = ref({
//   linear: {
//     name: "Linear",
//     expression: "linear",
//   },
//   exponential: {
//     name: "Exponential",
//     base: 0,
//     expression: "exponential",
//   },
//   cubicBezier: {
//     name: "Cubic Bezier",
//     x1: 1,
//     y1: 1,
//     x2: 1,
//     y2: 1,
//     expression: "cubic-bezier",
//   },
// });
const colorSteps = ref(6);
const colorPalettes = ref([]);
const colorPaletteOrRd = ref(chroma.scale("OrRd").colors(colorSteps.value));
const colorPaletteYlGnBu = ref(chroma.scale("YlGnBu").colors(colorSteps.value));
colorPalettes.value.push(colorPaletteOrRd.value, colorPaletteYlGnBu.value);
// const selectedColorPalette = ref(colorPalettes.value[0]);

const propertyOptions = getPropertiesFromSchema(props.heatFlowSchema);
const selectedProperty = ref("Select attribute");
console.log();
// const isPropertySelected = ref(false);
// const selectedInterpolationType = ref(interpolationTypes.value.linear);

watch(circleRadius, (currentValue) => {
  // change circle radius whene user changes value at input element

  props.map.setPaintProperty("sites", "circle-radius", parseInt(currentValue));
});

watch(selectedProperty, (newProperty) => {
  console.log(newProperty);
});

// throw out all properties options which are not suitable for the data driven coloring e.g. name,
// data points either be already classified (enum) or should be able to classify (continouse numerbs)
function getPropertiesFromSchema(schema) {
  const propertiesKey = Object.keys(schema.properties);
  let selectableOptions = [];

  propertiesKey.forEach((property) => {
    if (
      props.heatFlowSchema.properties[property].type == "string" &&
      !props.heatFlowSchema.properties[property].enum
    ) {
      console.log(property + " is not suitable for data driven coloring");
    } else {
      selectableOptions.push(property);
    }
  });

  return selectableOptions;
}

/** Pseudo code data driven colring algorithm
 * - [X] getProperties from data schema
 * - [X] make property selectable through <select> and <option> elements
 * - set default properties or get selected propertie of user
 * - get datatype of selected property (number or string)
 * - IF
 *      - number
 *          - get nr. of classes (either default or user input)
 *          - get type of classification (quantil equal amount of points in class or yenks natural breaks)
 *          - calculate breaks and return list
 *          - get selected color palette
 *              - adjust amount of steps according to nr of classes
 *          - write circle-color object for maplibrefunction setPaintProperties()
 * - ELSE IF
 *      - string
 *          - get enum classes
 *
 * - get selected color palette
 * - adjust amount of steps according to nr of classes
 * - write circle-color object for maplibrefunction setPaintProperties()
 */

// watch(colorSteps, (currentValue) => {
//   console.log("hier");
//   console.log(currentValue);
//   console.log(colorSteps.value);
//   console.log(selectedColorPalette.value);
//   console.log(colorPalettes.value[0].colors(currentValue));
// });

/**--------------------------------------------------------------------- */
// Methods
// onMounted(() => {
//   function testMethods() {
//     // let values = turfJenks(props.map.getSource("sites")._data, "elevation", 6);
//     // console.log("natrual breaks at: " + values);
//     // console.log(selectedColorPalette.value);
//     // props.map.setPaintProperty("sites", "circle-color", [
//     //   "case",
//     //   ["==", ["get", "elevation"], null],
//     //   "white",
//     //   [
//     //     "step",
//     //     ["get", "elevation"],
//     //     "#fff7ec",
//     //     -7490,
//     //     "#fddcaf",
//     //     -4489.9,
//     //     "#fdb27b",
//     //     -3290,
//     //     "#f26d4b",
//     //     -2090,
//     //     "#c91d13",
//     //     -640,
//     //     "#7f0000",
//     //     1050,
//     //     "#253494",
//     //   ],
//     // ]);

//     let x = [];
//     props.map.getSource("sites")._data.features.forEach((feature) => {
//       x.push(feature.properties["q"]);
//     });

//     let trace = {
//       x: x,
//       type: "histogram",
//       showlegend: true,
//     };

//     let data = [trace];
//     let plot = Plotly.newPlot("myTestDiv", data);
//     console.log(plot);
//   }

//   testMethods();
// });

/**
 * @description
 * @param {Array} newColorPalette
 */
// function setSelectedColorPalette(newColorPalette) {
//   selectedColorPalette.value = newColorPalette;
// }

/**
 * @description
 */
// function toggleIsSelected() {
//   //
//   if (isPropertySelected.value) {
//     return;
//   } else {
//     isPropertySelected.value = !isPropertySelected.value;
//   }
// }

/**
 * @description set Circle color
 * @param {String} colorHEX
 */
function setCircleColor(colorHEX) {
  if (props.map.getPaintProperty("sites", "circle-color") == colorHEX) {
    return;
  } else {
    props.map.setPaintProperty("sites", "circle-color", colorHEX);
  }
}

/**
 * @description
 * @param {String} featuresProperty
 */
// function setDataDrivenPaintProperties(featuresProperty) {
//   // TODO: Include case attribute with predefined classes
//   let paintProperties = [];

//   console.log(featuresProperty == "env");
//   // TODO: Include schema file for differenciation between continouse numeric values or enumerate
//   if (featuresProperty == "env") {
//     paintProperties = generateClassificationPaintProperty(featuresProperty);
//   } else {
//     paintProperties = generateInterpolatePaintProperty(featuresProperty);
//   }
//   console.log(paintProperties);

//   props.map.setPaintProperty("sites", "circle-color", paintProperties);
// }

/**
 * @description only for continuous number value, later on it should be working for any kind of property
 * @param {String} featuresProperty
 * @returns {Array} Array of MapLibre expression for paint properties for number values
 */
// function generateInterpolatePaintProperty(featuresProperty) {
//   let paintProperties = new Array();
//   const min = getMin(featuresProperty);
//   const max = getMax(featuresProperty);
//   const range = max - min;
//   const section = range / (colorSteps.value - 1);
//   let currentValue = min;
//   let expression = [];

//   if (selectedInterpolationType.value.name == "Linear") {
//     expression.push(selectedInterpolationType.value.expression);
//   } else if (selectedInterpolationType.value.name == "Exponential") {
//     expression.push(
//       selectedInterpolationType.value.expression,
//       selectedInterpolationType.value.base
//     );
//   } else if (selectedInterpolationType.value.name == "Cubic Bezier") {
//     expression.push(
//       selectedInterpolationType.value.expression,
//       selectedInterpolationType.value.x1,
//       selectedInterpolationType.value.y1,
//       selectedInterpolationType.value.x2,
//       selectedInterpolationType.value.y2
//     );
//   } else {
//     console.log("Type of interpolation not found");
//   }

//   paintProperties.push("interpolate");
//   paintProperties.push(expression);
//   paintProperties.push(["get", featuresProperty]); // TODO: adjust interpolation type or get rid of outlier

//   for (let i = 0; i < colorSteps.value; i++) {
//     paintProperties.push(currentValue, selectedColorPalette.value[i]);
//     currentValue += section;
//   }

//   return paintProperties;
// }

/**
 * @description get minimum value of features property
 * @param {String} featuresProperty
 * @returns {Number}
 */
// function getMin(featuresProperty) {
//   let min =
//     props.map.getSource("sites")._data.features[0].properties[featuresProperty];
//   props.map.getSource("sites")._data.features.forEach((feature) => {
//     if (feature.properties[featuresProperty] < min) {
//       min = feature.properties[featuresProperty];
//     }
//   });
//   return min;
// }

/**
 * @description get maximum value of features property
 * @param {String} featuresProperty
 * @returns {Number}
 */
// function getMax(featuresProperty) {
//   let max =
//     props.map.getSource("sites")._data.features[0].properties[featuresProperty];

//   props.map.getSource("sites")._data.features.forEach((feature) => {
//     if (feature.properties[featuresProperty] > max) {
//       max = feature.properties[featuresProperty];
//     }
//   });

//   return max;
// }

/**
 * @description
 * @param {String} featuresProperty
 * @returns {Array} Array of MapLibre expression for paint properties for enum values
 */
// function generateClassificationPaintProperty(featuresProperty) {
//   const classifications = getClassifications(featuresProperty);
//   let paintProperties = new Array();
//   colorSteps.value = classifications.size;

//   paintProperties.push("match");
//   paintProperties.push(["get", featuresProperty]);

//   // TODO: include chromajs lib for color ramps
//   let ix = 0;
//   classifications.forEach((entry) => {
//     paintProperties.push(entry, selectedColorPalette.value[ix]);
//     ix += 1;
//   });
//   paintProperties.push(/* other */ "#ccc");

//   console.log("Generate Class: " + paintProperties);
//   return paintProperties;
// }

/**
 * @description
 * @param {String} featuresProperty
 * @returns {Set} Set containg all possible values of a property
 */
// function getClassifications(featuresProperty) {
//   let classes = new Set();

//   props.map.getSource("sites")._data.features.forEach((feature) => {
//     classes.add(feature.properties[featuresProperty]);
//   });

//   return classes;
// }
</script>

<template>
  <div class="myTestDiv" id="myTestDiv"></div>
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
              >
                <!-- TODO: When single color is selected, make data driven colorization options disappear -->
              </button>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="circle-settings">
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
                v-for="(value, key) in propertyOptions"
                :key="key"
                :selectedProperty="{ value }"
              >
                {{ value }}
              </option>
            </select>
            <div
              class="data-driven-coloring-classification"
              v-if="isPropertySelected"
            >
              <!-- TODO: include data schema, show selecion only for continouse numeric values -->
              <label>Type of Classification</label>
              <select
                name="data-driven-coloring"
                id="data-driven-coloring"
                @change="console.log('Hallö')"
              >
                <option selected>Quantil</option>
                <option>
                  Jenks Natrual Breakes
                  <font-awesome-icon :icon="['fat', 'circle-info']" />
                </option>
              </select>
            </div>
            <div
              class="data-driven-coloring-nr-classes"
              v-if="isPropertySelected"
            >
              <!-- TODO: include data schema, show selecion only for continouse numeric values -->
              <label>Number of Classes</label>
              <select
                name="data-driven-coloring"
                id="data-driven-coloring"
                @change="console.log('Hallö')"
              >
                <option v-for="nr in 10" :key="nr">{{ nr }}</option>
              </select>
            </div>
            <div
              class="data-driven-coloring-interpolation"
              v-if="isPropertySelected"
            >
              <!-- TODO: include data schema, show selecion only for continouse numeric values -->
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
          </div>
        </fieldset>

        <fieldset>
          <div class="color-palettes" v-if="isPropertySelected">
            <label>Color Palette</label>
            <div class="color-steps">
              <label>Steps</label>
              <select name="color-steps-options" id="color-steps-options">
                <option selected disabled hidden>{{ colorSteps }}</option>
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
              class="color-palette-outer"
              v-for="colorPalette in colorPalettes"
              :key="colorPalette"
              @click="
                setSelectedColorPalette(colorPalette),
                  setDataDrivenPaintProperties(selectedProperty.key)
              "
            >
              <div class="color-palette-inner">
                <div
                  class="color"
                  v-for="color in colorPalette"
                  :key="color"
                  :style="{ 'background-color': color }"
                ></div>
              </div>
            </div>
          </div>
        </fieldset>
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

.color {
  display: inline-block;
  width: 36px;
  height: 20px;
  border: none;
  cursor: pointer;
}

.color-palette-inner:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
