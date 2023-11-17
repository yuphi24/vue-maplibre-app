import { defineStore } from "pinia";
import { ref } from "vue";

import * as SwaggerParser from "@apidevtools/swagger-parser";
import axios from "axios";
import gjv from "geojson-validation";

export const useMeasruementsStore = defineStore("measurements", () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */
  const geojson = ref(null);
  const dataSchema = ref(null);

  /**
   * @description
   * @param {String} url
   */
  function fetchAPIDataSchema(url) {
    //   /api/v1/schema/
    try {
      let parser = new SwaggerParser();
      parser.dereference(url).then((apiSchema) => {
        dataSchema.value = apiSchema.components.schemas.Measurement;
      });
    } catch (e) {
      console.log("error in fetching data schema" + e);
    }
  }

  /**
   * @description
   * @param {String} url
   * @param {Array} data
   * @returns {Array}
   */
  async function fetchPagedAPIData(url, data) {
    data = data || [];

    await axios
      .get(url)
      .then((response) => {
        response.data.results.forEach((entry) => {
          data.push(entry);
        });

        if (response.data.next != null) {
          // return fetchPagedAPIData(response.data.next, data);
        }
      })
      .catch((err) => {
        console.log("rejected", err);
      });

    return data;
  }

  /**
   * @description Gather information of each site and write it to GeoJSON feature
   * @param {Object} siteObject
   */
  function collectPntAttributes(siteObject) {
    const featKeys = Object.keys(siteObject);

    let coord = null;
    let property = {};

    featKeys.forEach((key) => {
      if (key == "sample") {
        if (siteObject[key].location != null) {
          coord = siteObject[key].location.point;
        }
      } else {
        // console.log("hat keine location");
        property[key] = siteObject[key];
      }
    });

    console.log("show property");
    console.log(property);
    return [siteObject["uuid"], coord, property];
  }

  /**
   * @description Write GeoJSON point feature and validate it
   * @param {String} uuid
   * @param {Array} coord
   * @param {Object} property
   */
  function writePntFeature(pntAttributes) {
    const feature = {
      uuid: pntAttributes[0],
      type: "Feature",
      geometry: pntAttributes[1],
      properties: pntAttributes[2],
    };

    if (gjv.isFeature(feature, true)) {
      return feature;
    } else {
      console.log(gjv.isFeature(feature, true));
    }
  }

  /**
   * @description fetch JSON from heat flow API and convert it to geojson
   * @param {String} url
   */
  async function convertAPIData2GeoJSON(url) {
    let measurements = await fetchPagedAPIData(url);
    let featuresArray = [];

    measurements.forEach((siteObject) => {
      // console.log(siteObject);
      const pntAttributes = collectPntAttributes(siteObject);
      featuresArray.push(writePntFeature(pntAttributes));
    });

    const featureCollection = {
      type: "FeatureCollection",
      features: featuresArray,
    };

    if (gjv.isFeatureCollection(featureCollection)) {
      return featureCollection;
    } else {
      console.log(gjv.isFeatureCollection(featureCollection, true));
    }
  }

  /**
   *
   * @param {String} url
   */
  function fetchAPIData(url) {
    geojson.value = convertAPIData2GeoJSON(url);
  }

  return { geojson, dataSchema, fetchAPIData, fetchAPIDataSchema };
});
