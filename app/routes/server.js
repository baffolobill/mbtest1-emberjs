import Ember from "ember";

export default Ember.Route.extend({
    model: function(params) {
        var model = this.get('container').lookupFactory('model:server');
        var uri = model.constructUri(params.server_id);
        return model.find(uri);
    }
});
