import BaseConnection from "mb-test-1/lib/connections/base-connection";
import ENV from "mb-test-1/config/environment";
import Model from "mb-test-1/models/core/model";
import ModelArray from "mb-test-1/models/core/model-array";

export default {
  name: "modelsAdapter",
  initialize: function(container, App) {
    var adapter;
    if (App.ADAPTER) {
      adapter = App.ADAPTER;
    } else {
      adapter = container.lookup("adapter:ajax");
    }
    var register = function(factoryName, host) {
      var klass = container.lookupFactory("model:" + factoryName);
      adapter.registerHostForType(klass, host);
    };
    register("node", ENV.APP.API_HOST);
    register("server", ENV.APP.API_HOST);
    container.register("adapter:main", adapter, { instantiate: false });
  }
};
