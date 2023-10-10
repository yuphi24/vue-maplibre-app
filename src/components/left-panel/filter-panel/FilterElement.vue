<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import VueMultiselect from "vue-multiselect";
import VueSlider from "vue-slider-component";

const props = defineProps({ id: Number, map: Map, heatFlowSchema: Object });
const emit = defineEmits(["send-filterExpression", "remove-filterElement"]);

const propertyOptions = ref(getSelectableProperties(props.heatFlowSchema));
const selectedProperty = ref(null);
const selectedPropertyType = ref(null);

const valueOptions = ref(null);
const selectedValues = ref([]);
// const onlyNullValue = ref(false);
const filterExpression = ref([]);

/**
 * @description Send filter expression to filterPanel
 */
const sendFilterExpression = () => {
  emit("send-filterExpression", {
    expression: filterExpression.value,
    id: props.id,
  });
};

/**
 * @description remove filterElement and corresponding filterExpression from filterPanel
 */
const removeFilterElement = () => {
  emit("remove-filterElement", { id: props.id });
};

/**
 *
 */
watch(selectedValues, () => {
  if (selectedValues.value.length > 0) {
    setFilterExpression(selectedProperty.value, selectedValues.value);
  } else if (selectedValues.value.length == 0) {
    props.map.setFilter("sites", undefined);
  }
});

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
      console.log(property + " is not suitable for filtering");
    } else {
      selectableOptions.push(property);
    }
  });

  return selectableOptions;
}

/**
 * @description Store data type of selected property
 * @param {String} selectedProperty
 */
function setSelectedPropertyType(selectedProperty) {
  selectedPropertyType.value =
    props.heatFlowSchema.properties[selectedProperty].type;
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
function getRange(geoJson, property) {
  const values = propertyValuesToArray(geoJson, property).filter(Boolean);

  const min = Math.min.apply(null, values);
  const max = Math.max.apply(null, values);

  const bounds = [min, max];

  return bounds;
}

/**
 * @description Set legal options for selected property
 * @param {String} selectedProperty
 */
function setValueOptions(selectedProperty) {
  if (selectedPropertyType.value == "string") {
    valueOptions.value = getEnumClasses(selectedProperty);
  } else if (selectedPropertyType.value == "number") {
    const geoJson = props.map.getSource("sites")._data;
    valueOptions.value = getRange(geoJson, selectedProperty);
    selectedValues.value = [valueOptions.value[0], valueOptions.value[1]];
  } else {
    console.log("Data type of property is not defined");
  }
}

/**
 * @description Resets the array with the selected filter values
 */
function resetSelectedValues() {
  if (
    selectedPropertyType.value == "number" &&
    valueOptions.value.length != 0
  ) {
    selectedValues.value = [valueOptions.value[0], valueOptions.value[1]];
  } else {
    selectedValues.value = [];
  }
}

function resetFilterExpression() {
  filterExpression.value = [];
}

/**
 * @description Generates filter expression for properties of type string with enum
 * @param {String} property
 * @param {Array} values
 * @returns {Array}
 */
function writeEnumFilter(property, values) {
  let filterExpression = ["any"];

  values.forEach((value) => {
    filterExpression.push(["in", ["get", property], value]);
  });

  // props.map.setFilter("sites", filterExpression);

  return filterExpression;
}

/**
 * @description Generates filter expression for properties of type number
 * @param {String} property
 * @param {Array} values
 * @returns {Array}
 */
function writeContinuousFilter(property, values) {
  const minValue = values[0];
  const maxValue = values[1];

  let filterExpression = [
    "all",
    [">=", ["get", property], minValue],
    ["<=", ["get", property], maxValue],
  ];

  // props.map.setFilter("sites", filterExpression);

  return filterExpression;
}

/**
 * @description
 * @returns {Void}
 */
function setFilterExpression(property, values) {
  if (!selectedProperty.value) {
    console.error("no property selected");
    return;
  } else if (selectedPropertyType.value == "string") {
    filterExpression.value = writeEnumFilter(property, values);
  } else if (selectedPropertyType.value == "number") {
    filterExpression.value = writeContinuousFilter(property, values);
  }
  // props.map.setFilter("sites", filterExpression);
}

// function testMultipleFilter() {
//   // let filterExpression1 = [
//   //   "all",
//   //   [">=", ["get", "q"], -126],
//   //   ["<=", ["get", "q"], 2000],
//   // ];

//   // let filterExpression2 = [["any"], ["in", ["get", "env"], "unspecified"]];

//   let combinedFilterExpression = [
//     "all",
//     [">=", ["get", "q"], -126],
//     ["<=", ["get", "q"], 0],
//     ["in", ["get", "env"], "unspecified"],
//   ];

//   props.map.setFilter("sites", combinedFilterExpression);
// }

/**
 * Helper function
 */
function printOutSelectedValues() {
  console.log("hier selectedValue");
  console.log(selectedValues.value);
}
</script>

<template>
  <div class="filter-element">
    <!-- 
      Multiselect:
      https://vue-multiselect.js.org/
     -->
    <div class="select-property">
      <label for="">Property</label>
      <VueMultiselect
        v-model="selectedProperty"
        :options="propertyOptions"
        @select="
          printOutValues, setSelectedPropertyType(selectedProperty);
          setValueOptions(selectedProperty);
          resetSelectedValues();
          printOutSelectedValues();
        "
      >
      </VueMultiselect>
    </div>

    <div class="filter-controller" v-if="selectedProperty">
      <div v-if="selectedPropertyType === 'string'">
        <label for="">Value</label>
        <VueMultiselect
          v-model="selectedValues"
          :options="valueOptions"
          :multiple="true"
          @select="
            printOutSelectedValues();
            setFilterExpression(selectedProperty, selectedValues);
            sendFilterExpression();
          "
          @remove="
            setFilterExpression(selectedProperty, selectedValues);
            sendFilterExpression();
          "
        >
        </VueMultiselect>
      </div>

      <!-- 
      Slider:
      https://www.npmjs.com/package/vue-slider-component 
      -->
      <div class="slider" v-if="selectedPropertyType === 'number'">
        <label for="">Value</label>
        <vue-slider
          v-model="selectedValues"
          :enableCross="false"
          :min="valueOptions[0]"
          :max="valueOptions[1]"
          :interval="0.01"
          @change="
            printOutSelectedValues();
            setFilterExpression(selectedProperty, selectedValues);
            sendFilterExpression();
          "
        ></vue-slider>

        <!-- TODO: Include null value OR select only null values as filter criteria -->
        <!-- <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault"
          />
          <label class="form-check-label" for="flexCheckDefault">
            Include null values
          </label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckChecked"
            @change="setOnlyNullValue"
          />
          <label class="form-check-label" for="flexCheckChecked">
            Only null values
          </label>
        </div> -->
      </div>
      <div class="reset-filter-btn" v-if="selectedValues.length > 0">
        <button
          class="btn btn-primary"
          @click="
            resetSelectedValues();
            resetFilterExpression();
            sendFilterExpression();
          "
        >
          Reset filter
        </button>
      </div>
      <div class="remove-filter-btn">
        <button class="btn btn-primary" @click="removeFilterElement()">
          Remove filter
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "vue-multiselect/dist/vue-multiselect.css";
@import "vue-slider-component/theme/default.css";
.filter-element {
  border-top: 4px inset;
}

.select-property {
  padding-bottom: 5px;
}

.filter-controller {
  padding-bottom: 5px;
}

.slider {
  padding: 15px;
}
</style>
