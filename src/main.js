import "@babel/polyfill";
import "mutationobserver-shim";

import { createApp } from "vue";
import App from "./App.vue";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

import "simplebar/dist/simplebar.min.css";

const app = createApp(App);

app.mount("#app");

console.log("hello");
