import TitleRoute from "./title";
import Node from "../models/node";

export default TitleRoute.extend({
    title: 'Node List',
    model: function(params) {
        /*var ret = Node.findAll();
        console.log(ret);
        return ret;//*/
        //return Node.findAll();
        return this.store.find('node');
    }
});
