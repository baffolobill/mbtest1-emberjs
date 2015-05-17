import Ember from "ember";

export default Ember.Route.extend({
    model: function(params) {
        var Node = this.get('container').lookupFactory('model:node');
        var nodeUri = Node.constructUri(params.node_id);
        return Node.find(nodeUri);
    }
});
