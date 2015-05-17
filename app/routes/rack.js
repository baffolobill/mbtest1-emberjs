import Ember from "ember";

export default Ember.Route.extend({
    model: function(params) {
        var model = this.get('container').lookupFactory('model:rack');
        var uri = model.constructUri(params.rack_id);
        return model.find(uri);
    }
});
