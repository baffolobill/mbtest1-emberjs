import Ember from "ember";

export default Ember.Route.extend({
    model: function(params) {
        var model = this.get('container').lookupFactory('model:basket');
        var uri = model.constructUri(params.basket_id);
        return model.find(uri);
    }
});
