import TypeMappings from "mb-test-1/models/core/type-mappings";

export default {
  name: "typeMappings",
  initialize: function(container, app) {
    var registerMapping = function(key, factoryName) {
      var klass = container.lookupFactory("model:" + (factoryName || key));
      return TypeMappings.addTypeMapping(key, klass);
    };
    registerMapping("Nodes", "node");
    registerMapping("Servers", "server");
    registerMapping("Baskets", "basket");
    registerMapping("Racks", "rack");
    registerMapping("Rows", "row");
    registerMapping("Rooms", "room");
    registerMapping("Floors", "floor");
    registerMapping("Components", "component");
    registerMapping("ServerTemplates", "servertemplate");
    registerMapping("Server Templates", "servertemplate");
    registerMapping("Properties", "property");
    registerMapping("PropertyOptions", "propertyoption");
    registerMapping("Property Options", "propertyoption");
  }
};
