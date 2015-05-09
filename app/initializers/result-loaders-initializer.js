var LOADER_NAMES = ["base", "nodes", "servers"];

export default {
  name: "resultLoaders",
  initialize: function(container) {
    var i, klass, len, name, results;
    results = [];
    for (i = 0, len = LOADER_NAMES.length; i < len; i++) {
      name = LOADER_NAMES[i];
      klass = require("mb-test-1/models/results-loaders/" + name)["default"];
      results.push(container.register("results-loader:" + name, klass));
    }
  }
};
