<script setup>
import { defineEmits, defineProps, ref, watch } from "vue";

// Extern Libraries
import geostats from "geostats";
// import turfJenks from "turf-jenks";
import { quantileSeq } from "mathjs";
import { Map } from "maplibre-gl";
import colorbrewer from "colorbrewer";

// Variables
const props = defineProps({ map: Map, heatFlowSchema: Object });
const emit = defineEmits(["send-legend"]);

const circleRadius = ref(5);

const propertyOptions = getSelectableProperties(props.heatFlowSchema);
const selectedProperty = ref("Select attribute");
const selectedPropertyDataType = ref();

const colorSteps = ref(4);
const selectedColorPalette = ref("BuGn");

const classificationTypes = ref({
  jenks: "Jenks (natural breakes)",
  quantil: "Quantil",
});
const selectedClassificationType = ref(classificationTypes.value.quantil);

const legend = ref({});
const sendLegend = () => {
  emit("send-legend", legend.value);
};

/**
 * If user changes size of circles, the watch method keeps track of it and adjust it synchron
 */
watch(circleRadius, (currentValue) => {
  // change circle radius whene user changes value at input element
  props.map.setPaintProperty("sites", "circle-radius", parseInt(currentValue));
});

/**
 * Updates selected property data type
 */
watch(selectedProperty, (newProperty) => {
  selectedPropertyDataType.value =
    props.heatFlowSchema.properties[newProperty].type;
});

/** Pseudo code data driven colring algorithm
 * - [X] getProperties from data schema
 * - [X] make property selectable through <select> and <option> elements
 * - [X] set default properties or get selected propertie of user
 * - [X] get datatype of selected property (number or string)
 * - [X] IF (number)
 *          - [X] get nr. of classes (either default or user input)
 *          - [X] get type of classification
 *                - [X] quantil https://mathjs.org/docs/reference/functions/quantileSeq.html
 *                - [X] jenks natural breaks turfjs
 *          - [X] calculate breaks and return list
 * - [X] ELSE IF (string)
 *          - [X] get enum classes
 * - [X] ELSE
 *      - [X] throw ERROR
 * - [X] get selected color palette
 * - [X] adjust amount of steps according to nr of classes
 * - [X] write circle-color object for maplibre function setPaintProperties()
 */

/**
 * @description Setter for current selected color palette
 * @param {String} colorPalette
 */
function setSelectedColorPalette(colorPalette) {
  selectedColorPalette.value = colorPalette;
  console.log(selectedColorPalette.value);
}

/**
 * @description Throw out all properties options which are not suitable for the data driven coloring e.g. name, data points either be already classified (enum) or should be able to classify (continouse numerbs)
 * @param {*} schema
 * @returns {Array}
 */
function getSelectableProperties(schema) {
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

/**
 * @description Collects all leagle enum classes from the data schema
 * @param {String} enumProperty
 * @returns {Array}
 */
function getEnumClasses(enumProperty) {
  return props.heatFlowSchema.properties[enumProperty].enum;
}

/**
 * @description Calculate breaks for jenks classification
 * @param {String} property
 * @param {Number} steps
 * @returns {Array} [minValue, break1, ..., breakN, maxValue]
 */
function getJenksNaturalBreaks(geoJson, property, steps) {
  const values = propertyValuesToArray(geoJson, property).filter(Boolean);
  let classifier = new geostats(values);
  let breaks = classifier.getJenks(steps);

  return breaks;
}

/**
 * @description Helper function for Math.quantileSeq() to collect only the values of a single property within one array
 * @param {*} geoJson
 * @param {String} property
 * @returns {Array}
 */
function propertyValuesToArray(geoJson, property) {
  let values = [];

  geoJson.features.forEach((feature) => {
    values.push(feature.properties[property]);
  });

  return values;
}

/**
 * @description Calculate breaks for quantil classification (each class has the same amount of data points)
 * @param {*} geoJson
 * @param {String} property
 * @param {Number} steps
 * @returns {Array}
 */
function getQuantilBreaks(geoJson, property, steps) {
  const values = propertyValuesToArray(geoJson, property).filter(Boolean);
  const breaks = quantileSeq(values, steps - 1);

  // add min value to beginning of array
  breaks.unshift(Math.min.apply(null, values));

  // add max value to end of array
  breaks.push(Math.max.apply(null, values));

  return breaks;
}

/**
 * @description Case differentiation if quantil or jenks is selected as classification method. According to the method, calculates the braks and returns them as array. Check the
 * following link for a explanation to qunatil and jenks data classification.
 * @link https://gisgeography.com/choropleth-maps-data-classification/
 * @returns {Array} [minValue, break1, ..., breakN, maxValue]
 */
function getNumberBreaks() {
  if (selectedClassificationType.value == classificationTypes.value.jenks) {
    return getJenksNaturalBreaks(
      props.map.getSource("sites")._data,
      selectedProperty.value,
      colorSteps.value
    );
  } else {
    return getQuantilBreaks(
      props.map.getSource("sites")._data,
      selectedProperty.value,
      colorSteps.value
    );
  }
}

/**
 * @description write array containg maplibre conform expressions for properties with enum values. Legal values are according to predefined classes
 * @param {String} property
 * @param {Array} classes
 * @param {Array} colors
 * @returns {Array} ["match", ["get", "property"], class, #color, ..., #colorOthers] --> https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
 */
function generateEnumPaintProperty(property, classes, colors) {
  let paintProperty = [];

  paintProperty.push("match");
  paintProperty.push(["get", property]);

  classes.forEach((value, index) => {
    paintProperty.push(value, colors[index]);
  });

  // others
  paintProperty.push("#ccc");

  return paintProperty;
}

/**
 * @description write array containg maplibre conform expressions for properties with continous number values. Each class (start value - end value) one color value is assigned.
 * @param {String} property
 * @param {Array} classes
 * @param {Array} colors
 * @returns {Array} ["step", ["get", "property"], #color, NUMBER, #color, ...]
 */
function generateContinuousPaintProperty(property, classes, colors) {
  let paintProperty = [];
  let k = 1;

  paintProperty.push("step");
  paintProperty.push(["get", property]);

  for (var i = 0; i < colors.length; i++) {
    paintProperty.push(colors[i]);
    if (i < colors.length - 1) {
      paintProperty.push(classes[k]);
      k++;
    }
  }

  return paintProperty;
}

/**
 * @description set up an object with relevant information for creating a legend
 * @param {Array} classes
 * @param {Array} colors
 */
function setLegendObject(classes, colors) {
  for (var i = 0; i < colors.length; i++) {
    if (colors.length == classes.length) {
      legend.value[i] = {
        id: i,
        text: classes[i],
        colorHEX: colors[i],
      };
    } else if (colors.length < classes.length) {
      legend.value[i] = {
        id: i,
        text: classes[i].toFixed(2) + " - " + classes[i + 1].toFixed(2),
        colorHEX: colors[i],
      };
    }
  }

  return legend;
}

/**
 * @description programm for providing and reacting to user driven colorisation of data according to properties
 * @returns {Void}
 */
function dataDrivenColorisation() {
  if (!selectedProperty.value) {
    console.error("no property selected");
  } else if (selectedPropertyDataType.value == "string") {
    // handling properties of data type string + enum
    let classes = getEnumClasses(selectedProperty.value);
    colorSteps.value = classes.length;
    const paintProperty = generateEnumPaintProperty(
      selectedProperty.value,
      classes,
      colorbrewer[selectedColorPalette.value][colorSteps.value]
    );
    props.map.setPaintProperty("sites", "circle-color", paintProperty);
    setLegendObject(
      classes,
      colorbrewer[selectedColorPalette.value][colorSteps.value]
    );
  } else if (selectedPropertyDataType.value == "number") {
    // handling properties of data type number
    let classes = getNumberBreaks();
    const paintProperty = generateContinuousPaintProperty(
      selectedProperty.value,
      classes,
      colorbrewer[selectedColorPalette.value][colorSteps.value]
    );
    props.map.setPaintProperty("sites", "circle-color", paintProperty);
    setLegendObject(
      classes,
      colorbrewer[selectedColorPalette.value][colorSteps.value]
    );
  }
}

/**
 * @description set Circle color
 * @param {String} colorHEX
 * @returns {Void}
 */
function setCircleColor(colorHEX) {
  if (props.map.getPaintProperty("sites", "circle-color") == colorHEX) {
    return;
  } else {
    props.map.setPaintProperty("sites", "circle-color", colorHEX);
  }
}
</script>

<template>
  <div class="myTestDiv" id="myTestDiv"></div>
  <div class="circle-styling-settings">
    <div class="settings-content-title">
      <h3>Style Circles</h3>
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
                v-for="colorHEX in colorbrewer['Paired'][9]"
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

      <div class="settings-content-title">
        <h3>Data driven coloring</h3>
      </div>
      <div class="circle-settings">
        <fieldset>
          <div class="data-driven-coloring">
            <div class="property-selection">
              <label>Coloring based on</label>
              <select
                class="form-select form-select-sm"
                name="data-driven-coloring"
                id="data-driven-coloring"
                v-model="selectedProperty"
                @change="dataDrivenColorisation(), sendLegend()"
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
            </div>

            <div class="color-selection">
              <label for="color-selection">Color Palette</label>
              <p>
                <button
                  class="btn-color-palette"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseExample"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                >
                  Select color palette
                </button>
              </p>
              <div class="collapse" id="collapseExample">
                <div class="card card-body">
                  <!-- TODO: show selected color palette via changeing backround on click -->
                  <div
                    class="color-palette"
                    v-for="(value, index) in colorbrewer.schemeGroups
                      .sequential"
                    :key="index"
                    @click="
                      setSelectedColorPalette(value), dataDrivenColorisation()
                    "
                  >
                    <div
                      class="color"
                      v-for="color in colorbrewer[value][colorSteps]"
                      :key="color"
                      :style="{ backgroundColor: color }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="data-classification-type"
              v-if="selectedPropertyDataType == 'number'"
            >
              <label for="data-classification-type">Data Classification</label>
              <select
                class="form-select form-select-sm"
                name="data-classification-type"
                id="data-classification-type"
                v-model="selectedClassificationType"
                @change="dataDrivenColorisation()"
              >
                <option
                  v-for="(value, key) in classificationTypes"
                  :key="key"
                  :selectedClassificationType="{ key }"
                >
                  {{ value }}
                </option>
              </select>
            </div>

            <div
              class="data-driven-coloring-steps"
              v-if="selectedPropertyDataType == 'number'"
            >
              <label>Number of Classes</label>
              <select
                class="form-select form-select-sm"
                name="data-driven-coloring"
                id="data-driven-coloring"
                v-model="colorSteps"
                @change="dataDrivenColorisation()"
              >
                <option v-for="n in 7" :key="n">
                  {{ n + 2 }}
                </option>
              </select>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-color-palette {
  display: block;
  width: 100%;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem; /* Similar padding to form-select */
  font-size: 0.875rem;
  text-align: left;
  line-height: 1.5;
  color: #212529; /* Bootstrap default text color */
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  border: 1px solid #ced4da; /* Border color */
  border-radius: 0.25rem; /* Border radius */
  appearance: none; /* This is to remove the default arrow of a real select element. Might not be needed for a div but added for completeness. */
  cursor: pointer; /* To give the feeling that it's clickable */
  /* Adding a faux dropdown arrow using a pseudo-element */
  &:after {
    /* content: "\0002c5"; */
    /* content: "\25BC"; Unicode down arrow */
    position: absolute;
    right: 0.5em;
    pointer-events: none; /* Make it non-interactive */
  }

  /* Styling for interaction states */
  &:hover {
    border-color: #b5b5b5;
  }

  &:active,
  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25); /* Bootstrap-style focus shadow */
    border-color: #0d6efd; /* Bootstrap primary blue */
  }
}

.card {
  cursor: default;
  width: 100%;
}

.color-palette {
  width: 100%;
  display: flex;
  padding: 1px;
}

.color {
  flex: 1;
  float: left;
  width: calc(100% / colorSteps);
  box-sizing: border-box;
}
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
