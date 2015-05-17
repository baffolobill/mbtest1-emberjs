import TitleRoute from "./title";
import ServerTemplate from "../models/servertemplate";

export default TitleRoute.extend({
    title: 'Server Template List',
    model: function(params) {
        var instance = ServerTemplate.create();
        return instance.getResultsLoader();
    }
});
