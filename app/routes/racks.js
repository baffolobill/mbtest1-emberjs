import TitleRoute from "./title";
import Rack from "../models/rack";

export default TitleRoute.extend({
    title: 'Rack List',
    model: function(params) {
        var instance = Rack.create();
        return instance.getResultsLoader();
    }
});
