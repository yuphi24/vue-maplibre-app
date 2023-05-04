const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,

  // below added to parse local geojson files https://stackoverflow.com/questions/65065631/cant-open-local-geojson-files-inside-vue-project
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.geojson$/,
          loader: "json-loader",
        },
      ],
    },
  },
});
