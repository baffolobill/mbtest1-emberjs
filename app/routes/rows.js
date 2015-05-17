import TitleRoute from "./title";
import Row from "../models/row";

export default TitleRoute.extend({
    title: 'Row List',
    model: function(params) {
        var instance = Row.create();
        return instance.getResultsLoader();
    }
});
