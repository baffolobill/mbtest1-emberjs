import Ember from "ember";

export default Ember.Route.extend({
    model: function(params) {
        var model = this.get('container').lookupFactory('model:room');
        var uri = model.constructUri(params.room_id);
        return model.find(uri);
    }
});
