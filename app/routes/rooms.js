import TitleRoute from "./title";
import Room from "../models/room";

export default TitleRoute.extend({
    title: 'Room List',
    model: function(params) {
        var instance = Room.create();
        return instance.getResultsLoader();
    }
});
