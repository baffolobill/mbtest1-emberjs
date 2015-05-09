import Ember from "ember";

export default Ember.Route.extend({
    pageTitle: 'Servers',
    model: function() {
        var node = this.modelFor("node");
        return node.getServersLoader();
    },
});
