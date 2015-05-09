import TypeMappings from "mb-test-1/models/core/type-mappings";

export default {
  name: "typeMappings",
  initialize: function(container, app) {
    var registerMapping = function(key, factoryName) {
      var klass = container.lookupFactory("model:" + (factoryName || key));
      return TypeMappings.addTypeMapping(key, klass);
    };
    registerMapping("node");
    registerMapping("server");
  }
};
