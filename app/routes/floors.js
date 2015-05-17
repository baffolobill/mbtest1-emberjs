import TitleRoute from "./title";
import Floor from "../models/floor";

export default TitleRoute.extend({
    title: 'Floor List',
    model: function(params) {
        var instance = Floor.create();
        return instance.getResultsLoader();
    }
});
