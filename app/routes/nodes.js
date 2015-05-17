import TitleRoute from "./title";
import Node from "../models/node";

export default TitleRoute.extend({
    title: 'Node List',
    model: function(params) {
        //var ret = Node.findAll();
        //Ember.Logger.debug('Route->Nodes->model: ');
        //Ember.Logger.debug(ret);
        //return ret;//*/
        var node = Node.create();
        return node.getResultsLoader();
    }
});
