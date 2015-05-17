import Ember from "ember";

export default Ember.Route.extend({
    model: function(params) {
        var model = this.get('container').lookupFactory('model:row');
        var uri = model.constructUri(params.row_id);
        return model.find(uri);
    }
});
