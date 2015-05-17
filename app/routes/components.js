import TitleRoute from "./title";
import Component from "../models/component";

export default TitleRoute.extend({
    title: 'Component List',
    model: function(params) {
        var instance = Component.create();
        return instance.getResultsLoader();
    }
});
