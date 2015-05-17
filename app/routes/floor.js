import Ember from "ember";

export default Ember.Route.extend({
    model: function(params) {
        var model = this.get('container').lookupFactory('model:floor');
        var uri = model.constructUri(params.floor_id);
        return model.find(uri);
    }
});
