import Ember from "ember";

export default Ember.Route.extend({
    model: function(params) {
        var model = this.get('container').lookupFactory('model:servertemplate');
        var uri = model.constructUri(params.servertemplate_id);
        return model.find(uri);
    }
});
