<script setup>
import { defineEmits, defineProps, ref, watch } from "vue";
import { useMeasurementStore } from "@/store/measurements";

import VueMultiselect from "vue-multiselect";

// Extern Libraries
import geostats from "geostats";
import { quantileSeq } from "mathjs";
import { Map } from "maplibre-gl";
import colorbrewer from "colorbrewer";

// Variables
const props = defineProps({ map: Map });
const emit = defineEmits(["send-legend"]);

const measurements = useMeasurementStore();

const circleRadius = ref(5);

const propertyOptions = getSelectableProperties(measurements.dataSchema);
const selectedProperty = ref(null);
const selectedPropertyDataType = ref();

const colorSteps = ref(4);
const selectedColorPalette = ref("BrBG");

const classificationTypes = ref([
  {
    name: "quantil",
    title: "Quantil",
  },
  {
    name: "jenks",
    title: "Jenks (natural breakes)",
  },
]);
const selectedClassificationType = ref(classificationTypes.value[0]);

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
// function setSelectedColorPalette(colorPalette) {
//   selectedColorPalette.value = colorPalette;
// }

/**
 * @description
 * @param {*} property
 * @returns {Boolean}
 */
function isPropertySelectable(property) {
  let isSelectable = null;

  if (
    measurements.dataSchema.properties[property].type == "string" &&
    !measurements.dataSchema.properties[property].enum
  ) {
    console.log(property + " is not suitable for data driven coloring");
    isSelectable = false;
  } else if (
    measurements.dataSchema.properties[property].type == "integer" &&
    (!measurements.dataSchema.properties[property].minimum ||
      !measurements.dataSchema.properties[property].maximum)
  ) {
    console.log(property + " is not suitable for data driven coloring");
    isSelectable = false;
  } else if (measurements.dataSchema.properties[property].type == "object") {
    console.log(property + " is not suitable for data driven coloring");
    isSelectable = false;
  } else {
    isSelectable = true;
  }
  return isSelectable;
}

/**
 * @description Takes property name and brings it to structure necessary for VueMultiselect component
 * @param {String} propertyName
 * @returns {Object}
 */
function createVueMultiselectOption(propertyName) {
  const propertyObj = measurements.dataSchema.properties[propertyName];
  let optionsObject = {};
  optionsObject["title"] = propertyObj.title;
  optionsObject["key"] = propertyName;

  return optionsObject;
}

/**
 * @description Throw out all properties options which are not suitable for the data driven coloring e.g. name, data points either be already classified (enum) or should be able to classify (continouse numerbs)
 * @param {*} schema
 * @returns {Array}
 */
function getSelectableProperties(schema) {
  const propertiesKey = Object.keys(schema.properties);
  let selectableProperties = [];

  propertiesKey.forEach((propertyName) => {
    if (isPropertySelectable(propertyName)) {
      selectableProperties.push(createVueMultiselectOption(propertyName));
    }
  });

  return selectableProperties;
}

/**
 * @description
 * @param {Object} property
 */
function setPropertyDataType(property) {
  selectedPropertyDataType.value =
    measurements.dataSchema.properties[property.key].type;
}

/**
 * @description Collects all leagle enum classes from the data schema
 * @param {Object} enumProperty
 * @returns {Array}
 */
function getEnumClasses(enumProperty) {
  let classes = [];

  measurements.dataSchema.properties[enumProperty].oneOf.forEach(
    (enumSchema) => {
      enumSchema.enum.forEach((enumClass) => {
        if (enumClass) {
          classes.push(enumClass);
        } else {
          // classes.push("null");
        }
      });
    }
  );
  console.log("getEnumClasses");
  console.log(classes);

  return classes;
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
 * @param {String} property
 * @returns {Array} [minValue, break1, ..., breakN, maxValue]
 */
function getNumberBreaks(property) {
  console.log("inside getNumberBreaks");
  console.log(selectedClassificationType.value);
  if (selectedClassificationType.value.name == "jenks") {
    return getJenksNaturalBreaks(
      props.map.getSource("sites")._data,
      property,
      colorSteps.value
    );
  } else {
    return getQuantilBreaks(
      props.map.getSource("sites")._data,
      property,
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

  console.log("generateEnumPaintProperty classes");
  console.log(classes);
  console.log("generateEnumPaintProperty colors");
  console.log(colors);

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
  legend.value = {};
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

  console.log("legend");
  console.log(legend.value);
  return legend;
}

/**
 * @description programm for providing and reacting to user driven colorisation of data according to properties
 * @returns {Void}
 */
function dataDrivenColorisation() {
  console.log("inside dataDrivenColorisation");
  console.log(selectedPropertyDataType.value);
  if (!selectedProperty.value) {
    console.error("no property selected");
  } else if (selectedPropertyDataType.value == "number") {
    // TODO: Fallunterscheidung Sequential/Diverging
    // handling properties of data type number
    let classes = getNumberBreaks(selectedProperty.value.key);
    const paintProperty = generateContinuousPaintProperty(
      selectedProperty.value.key,
      classes,
      colorbrewer[selectedColorPalette.value][colorSteps.value]
    );
    props.map.setPaintProperty("sites", "circle-color", paintProperty);
    setLegendObject(
      classes,
      colorbrewer[selectedColorPalette.value][colorSteps.value]
    );
  } else if (selectedPropertyDataType.value == undefined) {
    // TODO: Qualitativ Farpalette
    // handling properties of data type string + enum
    let classes = getEnumClasses(selectedProperty.value.key);
    colorSteps.value = classes.length;
    const paintProperty = generateEnumPaintProperty(
      selectedProperty.value.key,
      classes,
      colorbrewer[selectedColorPalette.value][colorSteps.value]
    );
    props.map.setPaintProperty("sites", "circle-color", paintProperty);
    setLegendObject(
      classes,
      colorbrewer[selectedColorPalette.value][colorSteps.value]
    );
  } else if (selectedPropertyDataType.value == "boolean") {
    console.log(selectedProperty.value.key + " is boolean");
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
  <!-- Circle Size  -->
  <p class="d-grid gap-2">
    <button
      class="btn btn-primary"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#circleSize"
      aria-expanded="false"
      aria-controls="circleSize"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-arrows-expand"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2M8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"
        />
      </svg>
      Circle Size
    </button>
  </p>
  <div class="collapse" id="circleSize">
    <div class="card card-body">
      <input
        type="range"
        class="form-range"
        id="customRange1"
        min="0"
        step="1"
        max="10"
        v-model="circleRadius"
      />
      <span class="text-muted text-center">{{ circleRadius }} px</span>
    </div>
  </div>

  <!-- Circle color -->
  <p class="d-grid gap-2">
    <button
      class="btn btn-primary"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#circleFillColor"
      aria-expanded="false"
      aria-controls="circleFillColor"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-arrows-expand"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2M8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"
        />
      </svg>
      Fill color
    </button>
  </p>
  <div class="collapse" id="circleFillColor">
    <div class="card card-body">
      <div class="btn-group" role="group" aria-label="Color Selection">
        <button
          type="button"
          class="btn btn-secondary"
          v-for="colorHEX in colorbrewer['Paired'][12]"
          :key="colorHEX"
          :style="{ 'background-color': colorHEX }"
          @click="setCircleColor(colorHEX)"
        ></button>
      </div>
    </div>
  </div>

  <!-- Data Driven Coloring -->
  <!-- Property selection -->
  <p class="d-grid gap-2">
    <button
      class="btn btn-primary"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#dataDrivenColoring"
      aria-expanded="false"
      aria-controls="dataDrivenColoring"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-arrows-expand"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2M8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"
        />
      </svg>
      Data Driven Coloring
    </button>
  </p>
  <div class="collapse" id="dataDrivenColoring">
    <div class="card card-body">
      <VueMultiselect
        v-model="selectedProperty"
        :options="propertyOptions"
        label="title"
        placeholder="Select property"
        @select="
          setPropertyDataType(selectedProperty),
            dataDrivenColorisation(),
            sendLegend()
        "
      >
      </VueMultiselect>
      <!-- Select classification method for number values -->
      <VueMultiselect
        v-if="selectedPropertyDataType == 'number'"
        v-model="selectedClassificationType"
        :options="classificationTypes"
        label="title"
        placeholder="Select data classification"
        @select="dataDrivenColorisation(), sendLegend()"
      >
      </VueMultiselect>
    </div>
  </div>

  <!--  -->
  <!-- <div
    class="data-classification-type"
    v-if="selectedPropertyDataType == 'number'"
  >
    <label for="data-classification-type">Data Classification</label>
    <select
      class="form-select form-select-sm"
      name="data-classification-type"
      id="data-classification-type"
      v-model="selectedClassificationType"
      @change="dataDrivenColorisation(), sendLegend()"
    >
      <option
        v-for="(value, key) in classificationTypes"
        :key="key"
        :selectedClassificationType="{ key }"
      >
        {{ value }}
      </option>
    </select>
  </div> -->

  <!-- <div class="settings-content-title">
        <h3>Data driven coloring</h3>
      </div>
      <div class="circle-settings">
        <fieldset>
          <div class="data-driven-coloring">
            <div class="color-selection">
              <label for="color-selection">Color Palette</label>
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
              <div class="collapse" id="collapseExample">
                <div class="card card-body">
                  TODO: show selected color palette via changeing backround on click
                  <div
                    class="color-palette"
                    v-for="(value, index) in colorbrewer.schemeGroups.diverging"
                    :key="index"
                    @click="
                      setSelectedColorPalette(value),
                        dataDrivenColorisation(),
                        sendLegend()
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
                @change="dataDrivenColorisation(), sendLegend()"
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
                @change="dataDrivenColorisation(), sendLegend()"
              >
                <option v-for="n in 8" :key="n">
                  {{ n + 2 }}
                </option>
              </select>
            </div>
          </div>
        </fieldset>
      </div> -->
</template>

<style scoped>
/* .btn-color-palette {
  display: block;
  width: 100%;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  font-size: 0.875rem;
  text-align: left;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  border: 1px solid #ced4da; 
  border-radius: 0.25rem; 
  appearance: none;
  cursor: pointer; 

  &:after {
    
    position: absolute;
    right: 0.5em;
    pointer-events: none; 
  }

  
  &:hover {
    border-color: #b5b5b5;
  }

  &:active,
  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    border-color: #0d6efd;
  }
} */

/* .card {
  cursor: default;
  width: 100%;
} */

/* .color-palette {
  width: 100%;
  display: flex;
  padding: 1px;
} */

/* .color {
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
} */
</style>
