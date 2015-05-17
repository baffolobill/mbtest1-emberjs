import TitleRoute from "./title";
import Server from "../models/server";

export default TitleRoute.extend({
    title: 'Server List',
    model: function(params) {
        var instance = Server.create();
        return instance.getResultsLoader();
    }
});
