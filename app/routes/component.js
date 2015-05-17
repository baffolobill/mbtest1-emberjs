import Ember from "ember";

export default Ember.Route.extend({
    model: function(params) {
        var model = this.get('container').lookupFactory('model:component');
        var uri = model.constructUri(params.component_id);
        return model.find(uri);
    }
});
